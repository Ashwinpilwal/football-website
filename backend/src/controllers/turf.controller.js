import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Turf} from "../models/turf.model.js";
import {Rating} from "../models/rating.model.js";
import {Booking} from "../models/booking.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


const createTurf = asyncHandler(async (req, res) => {

    const {
        name,
        type,
        address,
        latitude,
        longitude,
        pricePerHour,
        phone,
        openingTime,
        closingTime,
        amenities
    } = req.body;


    if (!name?.trim() || !type || !address?.trim()) {
        throw new ApiError(
            400,
            "Turf name, type, and address are required!"
        );
    }

    const lat = latitude !== undefined && latitude !== "" ? Number(latitude) : 31.2536;
    const lng = longitude !== undefined && longitude !== "" ? Number(longitude) : 75.7032;

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (uploadedImage?.url) {
                imageUrls.push(uploadedImage.url);
            }
        }
    }

    if (imageUrls.length === 0) {
        imageUrls.push("https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800");
    }

    let parsedAmenities = [];
    if (amenities) {
        try {
            parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
        } catch (e) {
            parsedAmenities = typeof amenities === "string" ? amenities.split(",").map(a => a.trim()) : [];
        }
    }

    const turf = await Turf.create({
        name: name.trim(),
        type,
        owner: req.user._id,
        address: address.trim(),
        location: {
            type: "Point",
            coordinates: [lng, lat]
        },
        images: imageUrls,
        pricePerHour: pricePerHour ? Number(pricePerHour) : 1200,
        phone: phone || "",
        openingTime: openingTime || "06:00 AM",
        closingTime: closingTime || "11:00 PM",
        amenities: parsedAmenities
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            turf,
            "Turf created successfully!"
        )
    );
});

const getAllTurfs = asyncHandler(async (req, res) => {

    const { lat, lng, maxDistanceKm } = req.query;

    let turfs;

    // If coordinates are provided, use geospatial $near query
    if (lat !== undefined && lng !== undefined) {

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxDistance = parseFloat(maxDistanceKm) || 50; // Default 50 km

        if (isNaN(latitude) || isNaN(longitude)) {
            throw new ApiError(400, "lat and lng must be valid numbers!");
        }

        turfs = await Turf.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance * 1000 // Convert km to metres
                }
            }
        }).populate("owner", "fullName username avatar email phone role");

    } else {

        // No coordinates provided — return all turfs
        turfs = await Turf.find().populate("owner", "fullName username avatar email phone role");

    }

    return res.status(200).json(
        new ApiResponse(
            200,
            turfs,
            lat && lng
                ? `Turfs within ${parseFloat(maxDistanceKm) || 50}km fetched successfully!`
                : "All turfs fetched successfully!"
        )
    );

});

const getTurfById = asyncHandler(async (req, res) => {

    const { turfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID");
    }

    const turf = await Turf.findById(turfId).populate("owner", "fullName username avatar email phone role");

    if (!turf) {
        throw new ApiError(404, "Turf not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            turf,
            "Turf fetched successfully",
        )
    );
});

const updateTurf = asyncHandler(async (req, res) => {

    const { turfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID!");
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
        throw new ApiError(404, "Turf not found!");
    }

    // Strict Ownership Enforcement: Only the owner admin can edit
    if (turf.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden: Only the admin who owns and listed this turf can edit it.");
    }

    const {
        name,
        type,
        address,
        latitude,
        longitude,
        pricePerHour,
        phone,
        openingTime,
        closingTime,
        amenities,
        existingImages
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (phone !== undefined) updateData.phone = phone;
    if (openingTime !== undefined) updateData.openingTime = openingTime;
    if (closingTime !== undefined) updateData.closingTime = closingTime;
    if (pricePerHour !== undefined) updateData.pricePerHour = Number(pricePerHour);

    if (type !== undefined) {
        if (!["turf", "playground"].includes(type)) {
            throw new ApiError(400, 'type must be "turf" or "playground"');
        }
        updateData.type = type;
    }

    if (amenities !== undefined) {
        updateData.amenities = typeof amenities === "string"
            ? JSON.parse(amenities)
            : amenities;
    }

    // Update location only if coordinates are provided
    if (latitude !== undefined && longitude !== undefined && latitude !== "" && longitude !== "") {
        updateData.location = {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
        };
    }

    // Handle Images Updating (Retain kept images + Upload new images)
    let currentImages = turf.images || [];

    if (existingImages !== undefined) {
        let keptImages = [];
        try {
            keptImages = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
            if (!Array.isArray(keptImages)) keptImages = [keptImages];
        } catch (e) {
            keptImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        // Clean up removed images from Cloudinary
        const removedImages = currentImages.filter((img) => !keptImages.includes(img));
        for (const imgUrl of removedImages) {
            try {
                const parts = imgUrl.split("/");
                const fileWithExt = parts[parts.length - 1];
                const publicId = fileWithExt.split(".")[0];
                if (publicId) await deleteFromCloudinary(publicId, "image");
            } catch (err) {
                console.log("Cloudinary image deletion error:", err);
            }
        }

        currentImages = keptImages;
    }

    // Upload newly provided files
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (uploadedImage?.url) {
                currentImages.push(uploadedImage.url);
            }
        }
    }

    updateData.images = currentImages;

    const updatedTurf = await Turf.findByIdAndUpdate(
        turfId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate("owner", "fullName username avatar email phone role");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTurf,
            "Turf updated successfully!"
        )
    );

});


const deleteTurf = asyncHandler(async (req, res) => {

    const { turfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID!");
    }

    const turf = await Turf.findById(turfId);

    if (!turf) {
        throw new ApiError(404, "Turf not found!");
    }

    // Strict Ownership Enforcement: Only the owner admin can delete
    if (turf.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden: Only the admin who owns and listed this turf can delete it.");
    }

    // 1. Cascade delete all ratings and reviews for this turf
    await Rating.deleteMany({ turf: turfId });

    // 2. Cascade delete all bookings for this turf
    await Booking.deleteMany({ turf: turfId });

    // 3. Delete all images from Cloudinary
    for (const imageUrl of turf.images) {
        try {
            const parts = imageUrl.split("/");
            const fileWithExt = parts[parts.length - 1];
            const publicId = fileWithExt.split(".")[0];
            if (publicId) {
                await deleteFromCloudinary(publicId, "image");
            }
        } catch (err) {
            console.log("Cloudinary image delete error:", err);
        }
    }

    // 4. Delete the Turf document
    await Turf.findByIdAndDelete(turfId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Turf and all associated ratings, reviews, and bookings deleted successfully!"
        )
    );

});


export { createTurf, getAllTurfs, getTurfById, updateTurf, deleteTurf };