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

    let initialThumbnail = imageUrls[0] || "";
    if (req.body.thumbnail && typeof req.body.thumbnail === "string" && req.body.thumbnail.trim()) {
        const customThumb = req.body.thumbnail.trim();
        if (imageUrls.includes(customThumb)) {
            initialThumbnail = customThumb;
            const idx = imageUrls.indexOf(customThumb);
            if (idx > 0) {
                imageUrls.splice(idx, 1);
                imageUrls.unshift(customThumb);
            }
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
        thumbnail: initialThumbnail,
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

    // Use query coordinates or fallback to authenticated user's saved DB location (e.g. during location off)
    const effectiveLat = (lat !== undefined && lat !== "") ? lat : req.user?.location?.lat;
    const effectiveLng = (lng !== undefined && lng !== "") ? lng : req.user?.location?.lon;

    let turfs;

    // If coordinates are provided, use geospatial $near query (sorted closest first)
    if (effectiveLat !== undefined && effectiveLat !== null && effectiveLng !== undefined && effectiveLng !== null) {

        const latitude = parseFloat(effectiveLat);
        const longitude = parseFloat(effectiveLng);

        if (isNaN(latitude) || isNaN(longitude)) {
            throw new ApiError(400, "lat and lng must be valid numbers!");
        }

        const nearGeometry = {
            type: "Point",
            coordinates: [longitude, latitude]
        };

        const nearQuery = {
            $near: {
                $geometry: nearGeometry
            }
        };

        // Only enforce strict maxDistance if client explicitly requested maxDistanceKm in query
        if (maxDistanceKm && !isNaN(parseFloat(maxDistanceKm))) {
            nearQuery.$near.$maxDistance = parseFloat(maxDistanceKm) * 1000;
        }

        try {
            turfs = await Turf.find({
                location: nearQuery
            }).populate("owner", "fullName username avatar email phone role");
        } catch (geoErr) {
            console.error("Geospatial $near query error, falling back to all turfs:", geoErr);
            turfs = await Turf.find().populate("owner", "fullName username avatar email phone role");
        }

        // If strict distance filter yielded zero turfs, fall back to nearest turfs without distance cap
        if (!turfs || turfs.length === 0) {
            try {
                turfs = await Turf.find({
                    location: {
                        $near: {
                            $geometry: nearGeometry
                        }
                    }
                }).populate("owner", "fullName username avatar email phone role");
            } catch (fallbackGeoErr) {
                turfs = await Turf.find().populate("owner", "fullName username avatar email phone role");
            }
        }

    } else {

        // No coordinates provided — return all turfs
        turfs = await Turf.find().populate("owner", "fullName username avatar email phone role");

    }

    // Ultimate fallback if still empty
    if (!turfs || turfs.length === 0) {
        turfs = await Turf.find().populate("owner", "fullName username avatar email phone role");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            turfs,
            "Turfs fetched successfully!"
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
        existingImages,
        imageOrder,
        thumbnail
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

    // 1. Upload newly provided files from req.files to Cloudinary in order
    const uploadedUrls = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (uploadedImage?.url) {
                uploadedUrls.push(uploadedImage.url);
            }
        }
    }

    const currentImages = Array.isArray(turf.images) ? turf.images : [];
    let finalImages = [];
    const keptExistingImages = [];

    // 2. Process imageOrder if supplied by client to preserve exact user-reordered sequence
    if (imageOrder !== undefined) {
        let orderTokens = [];
        try {
            orderTokens = typeof imageOrder === "string" ? JSON.parse(imageOrder) : imageOrder;
            if (!Array.isArray(orderTokens)) orderTokens = [orderTokens];
        } catch (e) {
            orderTokens = Array.isArray(imageOrder) ? imageOrder : [imageOrder];
        }

        for (const token of orderTokens) {
            if (typeof token === "string" && token.startsWith("NEW_")) {
                const idx = parseInt(token.replace("NEW_", ""), 10);
                if (!isNaN(idx) && uploadedUrls[idx]) {
                    finalImages.push(uploadedUrls[idx]);
                }
            } else if (typeof token === "string" && token.trim()) {
                finalImages.push(token.trim());
                keptExistingImages.push(token.trim());
            }
        }

        // Safety: Append any newly uploaded files that weren't captured by the tokens
        for (const upUrl of uploadedUrls) {
            if (!finalImages.includes(upUrl)) {
                finalImages.push(upUrl);
            }
        }
    } else if (existingImages !== undefined) {
        // Fallback for requests that don't send imageOrder
        try {
            const parsed = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            keptExistingImages.push(...arr);
        } catch (e) {
            const arr = Array.isArray(existingImages) ? existingImages : [existingImages];
            keptExistingImages.push(...arr);
        }
        finalImages = [...keptExistingImages, ...uploadedUrls];
    } else if (uploadedUrls.length > 0) {
        finalImages = [...currentImages, ...uploadedUrls];
        keptExistingImages.push(...currentImages);
    } else {
        finalImages = [...currentImages];
        keptExistingImages.push(...currentImages);
    }

    // 3. Clean up removed images from Cloudinary
    if (imageOrder !== undefined || existingImages !== undefined) {
        const removedImages = currentImages.filter((img) => !keptExistingImages.includes(img));
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
    }

    // 4. Resolve Thumbnail & Cover (Position #0)
    let selectedThumbnail = "";
    if (thumbnail !== undefined && typeof thumbnail === "string" && thumbnail.trim()) {
        const thumbToken = thumbnail.trim();
        if (thumbToken.startsWith("NEW_")) {
            const idx = parseInt(thumbToken.replace("NEW_", ""), 10);
            if (!isNaN(idx) && uploadedUrls[idx]) {
                selectedThumbnail = uploadedUrls[idx];
            }
        } else {
            selectedThumbnail = thumbToken;
        }
    }

    // If a thumbnail was explicitly set, move it to index 0 of finalImages
    if (selectedThumbnail) {
        const thumbIdx = finalImages.indexOf(selectedThumbnail);
        if (thumbIdx > 0) {
            finalImages.splice(thumbIdx, 1);
            finalImages.unshift(selectedThumbnail);
        } else if (thumbIdx === -1) {
            finalImages.unshift(selectedThumbnail);
        }
    }

    if (finalImages.length > 0) {
        updateData.images = finalImages;
        updateData.thumbnail = selectedThumbnail || finalImages[0] || "";
    } else if (currentImages.length > 0) {
        updateData.images = currentImages;
        updateData.thumbnail = currentImages[0] || "";
    }

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