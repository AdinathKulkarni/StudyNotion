const Course = require('../models/course');
const Category = require('../models/category');
const User = require('../models/user');
const {imageUploader, uploadToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

exports.createCourse = async(req, res) => {
    try{

        //fetch all data
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

         const categoryDetails = await Category.findById(category);
         if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category details not found",
            });
         }

         //upload image to cloudinary
         const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);
         const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,
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
                                        ).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses,
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the courses",
            error: error.message,
        })
    }
}

exports.getCourseDetails = async(req, res) => {
    try{

        const {courseId} = req.body;
        const courseDetails = await Course.find({_id: courseId})
                                                .populate({
                                                    path: "instructor",
                                                    populate: {
                                                        path: "additionalDetails"
                                                    }
                                                })
                                                .populate("category")
                                                .populate("ratingAndReviews")
                                                .populate({
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSection",
                                                    }, 
                                                })
                                                .exec();
        
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find course with ${courseId}`,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course Details fetched Successfully",
            data: courseDetails,
        })

    } catch(error) {
        return res.status.json({
            success: false,
            message: "Failed to fetch course details",
        })
    }
}