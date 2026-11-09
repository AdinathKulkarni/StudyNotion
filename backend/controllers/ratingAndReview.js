const RatingAndReview = require('../models/ratingAndReview');
const Course = require('../models/course');
const mongoose = require('mongoose');

exports.createRating = async(req, res) => {
    try{

        //get user id
        const userId = req.user.id;

        //fetch data from req body
        const {rating, review, courseId} = req.body;

        if(!mongoose.isValidObjectId(courseId) ||
            !Number.isFinite(Number(rating)) ||
            Number(rating) < 1 || Number(rating) > 5 ||
            typeof review !== 'string' || !review.trim()){
            return res.status(400).json({
                success: false,
                message: 'Please provide a course, a rating from 1 to 5, and a review',
            });
        }

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id: courseId,
            studentEnrolled: {$elemMatch: {$eq: userId}}
        });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Unable to fetch the course Details",
            });
        }

        //check if user has already reviewed that course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "User has already reviewed the course",
            });
        }

        //create a rating
        const reviewAndRating = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        })

        //attach it with course

        await Course.findByIdAndUpdate(
            courseId,
            {
                $addToSet: {
                    ratingAndReviews: reviewAndRating._id,
                }
            },
            {new: true},
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            ratingAndReview: reviewAndRating,
        })
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create a rating",
            error: error.message,
        })
    }
}

exports.getAverageRating = async(req, res) => {
    try{
        
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null, 
                    averageRating: { $avg: "$rating" },
                }
            }
        ]);

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no ratings given till now",
        })

    } catch(error){

    }
}

exports.getAllRatings = async(req, res) => {
    try{ 
        const allReviews = await RatingAndReview.find({})
        .sort({rating: "desc"})
        .populate({
            path: "user",
            select: "firstName lastName email image",
        })
        .populate({
            path: "course",
            select: "courseName",
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            allReviews,
        })

    } catch(error){

        return res.status(500).json({
            success: false,
            message: "Error while fetching all the reivews",
            error: error.message,
        })

    }   
}