const SubSection = require('../models/subSection');
const Section = require('../models/section');
const cloudinary = require('../utils/imageUploader');

exports.createSubSection = async(req, res) => {
    try{

        //fetch data
        const {title, timeDuration, description, videoUrl, sectionId} = req.body;

        //get secure_url of video
        const video = req.files.videoFile;

        //validate
        if(!title || !timeDuration || !timeDuration || !description || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        //upload to cloudinary
        const uploadedVideo = await cloudinary.uploadToCloudinary(video, process.env.FOLDER_NAME);

        //create a subsectino
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadedVideo.secure_url,
        })

        //push inside section object
        const updatedSubSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            {new: true},
        );

        //return response
        return res.status(201).json({
            success: true,
            message: "Sub-section created successfully",
            data: updatedSubSection,
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while creating sub-section",
            error: error.message,
        })
    }
}

exports.updateSubSection = async(req, res) => {
    try{
        const {subSectionId, title, timeDuration, description} = req.body;
        const video = req.files && req.files.videoFile;

        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "Sub-section ID is required",
            });
        }

        const updates = {};
        if(title !== undefined) updates.title = title;
        if(timeDuration !== undefined) updates.timeDuration = timeDuration;
        if(description !== undefined) updates.description = description;

        if(video){
            const uploadedVideo = await cloudinary.uploadToCloudinary(video, process.env.FOLDER_NAME);
            updates.videoUrl = uploadedVideo.secure_url;
        }

        if(Object.keys(updates).length === 0){
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            updates,
            {new: true, runValidators: true},
        );

        if(!updatedSubSection){
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully",
            data: updatedSubSection,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating sub-section",
            error: error.message,
        });
    }
}

exports.deleteSubSection = async(req, res) => {
    try{
        const {subSectionId} = req.body;

        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "Sub-section ID is required",
            });
        }

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if(!deletedSubSection){
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }

        await Section.updateMany(
            {subSection: subSectionId},
            {$pull: {subSection: subSectionId}},
        );

        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully",
            data: deletedSubSection,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting sub-section",
            error: error.message,
        });
    }
}