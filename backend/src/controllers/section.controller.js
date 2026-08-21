import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary
} from "../utils/cloudinary.js";
import { Section } from "../models/section.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";


const createSection = asyncHandler(async (req, res) => {

    const { name } = req.body;

    if (!name?.trim()) {
        throw new ApiError(
            400,
            "Name is required!"
        );
    }


    const coverImagePath = req.file?.path;

    let uploadedCoverImage = null;

    if (coverImagePath) {

        uploadedCoverImage =
            await uploadOnCloudinary(
                coverImagePath
            );

        if (!uploadedCoverImage) {
            throw new ApiError(
                400,
                "Unable to upload cover image!"
            );
        }
    }


    const section = await Section.create({

        name: name.trim(),

        owner: req.user._id,

        coverImage: uploadedCoverImage
            ? {
                url: uploadedCoverImage.secure_url,
                public_id: uploadedCoverImage.public_id
            }
            : {
                url: "",
                public_id: ""
            }
    });


    if (!section) {
        throw new ApiError(
            400,
            "Unable to create section!"
        );
    }


    return res.status(201).json(
        new ApiResponse(
            201,
            section,
            "Section created successfully!"
        )
    );
});



const getUserSections = asyncHandler(async (req, res) => {

    const { username } = req.params;


    const user = await User.findOne({
        username: username.toLowerCase()
    }).select("_id");


    if (!user) {
        throw new ApiError(
            404,
            "User not found!"
        );
    }


    const sections = await Section.find({
        owner: user._id
    })
    .sort({ createdAt: -1 });


    return res.status(200).json(
        new ApiResponse(
            200,
            sections,
            "User sections fetched successfully!"
        )
    );
});



const getMySections = asyncHandler(async (req, res) => {

    const sections = await Section.find({
        owner: req.user._id
    })
    .sort({ createdAt: -1 });


    return res.status(200).json(
        new ApiResponse(
            200,
            sections,
            "Sections fetched successfully!"
        )
    );
});



const getSectionById = asyncHandler(async (req, res) => {

    const { sectionId } = req.params;


    const section = await Section.findById(
        sectionId
    )
    .populate(
        "owner",
        "username fullName avatar"
    );


    if (!section) {
        throw new ApiError(
            404,
            "Section not found!"
        );
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            section,
            "Section fetched successfully!"
        )
    );
});



const updateSection = asyncHandler(async (req, res) => {

    const { sectionId } = req.params;
    const { name } = req.body;


    if (
        name === undefined &&
        !req.file
    ) {
        throw new ApiError(
            400,
            "Nothing to update!"
        );
    }


    const section = await Section.findOne({
        _id: sectionId,
        owner: req.user._id
    });


    if (!section) {
        throw new ApiError(
            404,
            "Section not found or you are not the owner!"
        );
    }


    const updateData = {};


    // Update name

    if (name !== undefined) {

        if (!name.trim()) {
            throw new ApiError(
                400,
                "Section name cannot be empty!"
            );
        }

        updateData.name = name.trim();
    }


    // Update cover image

    if (req.file) {

        const newCoverImage =
            await uploadOnCloudinary(
                req.file.path
            );


        if (!newCoverImage) {
            throw new ApiError(
                400,
                "Unable to upload cover image!"
            );
        }


        // Delete old cover

        if (section.coverImage?.public_id) {

            await deleteFromCloudinary(
                section.coverImage.public_id,
                "image"
            );
        }


        updateData.coverImage = {
            url: newCoverImage.secure_url,
            public_id: newCoverImage.public_id
        };
    }


    const updatedSection =
        await Section.findByIdAndUpdate(
            sectionId,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        );


    return res.status(200).json(
        new ApiResponse(
            200,
            updatedSection,
            "Section updated successfully!"
        )
    );
});



const deleteSection = asyncHandler(async (req, res) => {

    const { sectionId } = req.params;


    const section = await Section.findOne({
        _id: sectionId,
        owner: req.user._id
    });


    if (!section) {
        throw new ApiError(
            404,
            "Section not found or you are not the owner!"
        );
    }


    // 1. Reset section on all posts that were categorized under this section
    await Post.updateMany(
        { section: sectionId },
        { $set: { section: null } }
    );

    // 2. Delete cover from Cloudinary
    if (section.coverImage?.public_id) {
        try {
            await deleteFromCloudinary(
                section.coverImage.public_id,
                "image"
            );
        } catch (err) {
            console.log("Cloudinary section cover delete error:", err);
        }
    }

    // 3. Delete the Section document
    await Section.findByIdAndDelete(
        sectionId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            section,
            "Section deleted and associated posts updated successfully!"
        )
    );
});



export {
    createSection,
    getUserSections,
    getMySections,
    getSectionById,
    updateSection,
    deleteSection
};