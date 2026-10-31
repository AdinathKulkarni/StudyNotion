const Course = require('../models/course');
const Category = require('../models/category');
const User = require('../models/user');
const Section = require('../models/section');
const SubSection = require('../models/subSection');
const CourseProgress = require('../models/courseProgress');
const RatingAndReview = require('../models/ratingAndReview');
const mongoose = require('mongoose');
const {uploadToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

exports.createCourse = async(req, res) => {
    try{

        //fetch all data
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //get thumbnail
        const thumbnail = req.files && req.files.thumbnailImage;

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

        await Promise.all([
            User.findByIdAndUpdate(instructorDetails._id, {
                $addToSet: {courses: newCourse._id},
            }),
            Category.findByIdAndUpdate(categoryDetails._id, {
                $addToSet: {course: newCourse._id},
            }),
        ]);

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
        if(!courseId || !mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course ID',
            });
        }

        const courseDetails = await Course.findById(courseId)
                                                .populate({
                                                    path: "instructor",
                                                    populate: {
                                                        path: "additionalDetails"
                                                    }
                                                })
                                                .populate("category")
                                                .populate({
                                                    path: "ratingAndReviews",
                                                    populate: {
                                                        path: "user",
                                                        select: "firstName lastName image",
                                                    },
                                                })
                                                .populate({
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSection",
                                                    }, 
                                                })
                                                .exec();
        
        if(!courseDetails){
            return res.status(404).json({
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
            error: error.message,
        })
    }
}

exports.getFullCourseDetails = async(req, res) => {
    try{
        const {courseId} = req.body;
        if(!courseId || !mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course ID',
            });
        }

        const course = await Course.findById(courseId)
            .populate({
                path: 'instructor',
                select: 'firstName lastName image',
                populate: {
                    path: 'additionalDetails',
                    select: 'gender about',
                },
            })
            .populate('category')
            .populate({
                path: 'ratingAndReviews',
                populate: {
                    path: 'user',
                    select: 'firstName lastName image',
                },
            })
            .populate({
                path: 'courseContent',
                populate: {path: 'subSection'},
            })
            .exec();

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const isEnrolled = course.studentEnrolled.some(
            (studentId) => studentId.toString() === req.user.id,
        );

        return res.status(200).json({
            success: true,
            message: 'Full course details fetched successfully',
            data: {
                ...course.toObject(),
                isEnrolled,
            },
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching full course details',
            error: error.message,
        });
    }
}

exports.editCourse = async(req, res) => {
    try{
        const {courseId, courseName, courseDescription, whatYouWillLearn, price, category} = req.body;
        const thumbnail = req.files && req.files.thumbnailImage;

        if(!courseId || !mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course ID',
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            instructor: req.user.id,
        });
        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found or you do not have permission to edit it',
            });
        }

        const updates = {};
        if(courseName !== undefined){
            if(typeof courseName !== 'string' || !courseName.trim()){
                return res.status(400).json({
                    success: false,
                    message: 'Course name cannot be empty',
                });
            }
            updates.courseName = courseName.trim();
        }
        if(courseDescription !== undefined){
            if(typeof courseDescription !== 'string' || !courseDescription.trim()){
                return res.status(400).json({
                    success: false,
                    message: 'Course description cannot be empty',
                });
            }
            updates.courseDescription = courseDescription;
        }
        if(whatYouWillLearn !== undefined){
            if(typeof whatYouWillLearn !== 'string' || !whatYouWillLearn.trim()){
                return res.status(400).json({
                    success: false,
                    message: 'Learning outcomes cannot be empty',
                });
            }
            updates.whatYouWillLearn = whatYouWillLearn;
        }
        if(price !== undefined){
            const parsedPrice = Number(price);
            if(!Number.isFinite(parsedPrice) || parsedPrice < 0){
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a non-negative number',
                });
            }
            updates.price = parsedPrice;
        }

        let newCategory;
        if(category !== undefined){
            if(!mongoose.isValidObjectId(category)){
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid category ID',
                });
            }
            newCategory = await Category.findById(category);
            if(!newCategory){
                return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            updates.category = newCategory._id;
        }

        if(thumbnail){
            const uploadedThumbnail = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);
            updates.thumbnail = uploadedThumbnail.secure_url;
        }

        if(Object.keys(updates).length === 0){
            return res.status(400).json({
                success: false,
                message: 'Provide at least one course field to update',
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {$set: updates},
            {new: true, runValidators: true},
        );

        if(newCategory && (!course.category || course.category.toString() !== newCategory._id.toString())){
            const categoryUpdates = [
                Category.findByIdAndUpdate(newCategory._id, {
                    $addToSet: {course: course._id},
                }),
            ];
            if(course.category){
                categoryUpdates.push(Category.findByIdAndUpdate(course.category, {
                    $pull: {course: course._id},
                }));
            }
            await Promise.all(categoryUpdates);
        }

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating course',
            error: error.message,
        });
    }
}

exports.getInstructorCourses = async(req, res) => {
    try{
        const courses = await Course.find({instructor: req.user.id})
            .populate('category', 'name')
            .populate('ratingAndReviews', 'rating')
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Instructor courses fetched successfully',
            data: courses,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching instructor courses',
            error: error.message,
        });
    }
}

exports.deleteCourse = async(req, res) => {
    try{
        const {courseId} = req.body;
        if(!courseId || !mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid course ID',
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            instructor: req.user.id,
        });
        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Course not found or you do not have permission to delete it',
            });
        }

        const sections = await Section.find({_id: {$in: course.courseContent}})
            .select('subSection')
            .exec();
        const subSectionIds = sections.flatMap((section) => section.subSection);
        const progressRecords = await CourseProgress.find({courseId: course._id})
            .select('_id')
            .exec();
        const progressIds = progressRecords.map((record) => record._id);

        await Promise.all([
            SubSection.deleteMany({_id: {$in: subSectionIds}}),
            Section.deleteMany({_id: {$in: course.courseContent}}),
            RatingAndReview.deleteMany({_id: {$in: course.ratingAndReviews}}),
            CourseProgress.deleteMany({_id: {$in: progressIds}}),
            progressIds.length
                ? User.updateMany(
                    {courseProgress: {$in: progressIds}},
                    {$pull: {courseProgress: {$in: progressIds}}},
                )
                : Promise.resolve(),
            User.findByIdAndUpdate(course.instructor, {
                $pull: {courses: course._id},
            }),
            course.category
                ? Category.findByIdAndUpdate(course.category, {
                    $pull: {course: course._id},
                })
                : Promise.resolve(),
        ]);

        await Course.findByIdAndDelete(course._id);

        return res.status(200).json({
            success: true,
            message: 'Course and its content deleted successfully',
            data: {courseId: course._id},
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while deleting course',
            error: error.message,
        });
    }
}