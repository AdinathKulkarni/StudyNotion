const Course = require('../models/course');
const Tag = require('../models/tag');
const User = require('../models/user');
const {imageUploader, uploadToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

exports.createCourse = async(req, res) => {
    try{

        //fetch all data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById({userId});

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

         const tagDetails = await Tag.findById(tag);
         if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag details not found",
            });
         }

         //upload image to cloudinary
         const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);
         const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructorDetails: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        )

        return res.status(201).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while creating course",
            error: error.message,
        });
    }
}

exports.getAllCourses = async(req, res) => {
    try{

        const allCourses = await Course.find({},
                                            {courseName: true}, 
                                            {price: true}, 
                                            {thumbail: true}, 
                                            {instructor: true}, 
                                            {ratingAndReviews: true}, 
                                            {studentEnrolled: true}
                                        ).populate("Instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses,
        })

    } catch(error){
        return res.status(500).json({
            success: true,
            message: "Error while fetching all the courses",
            error: error.message,
        })
    }
}