const mongoose = require('mongoose');
const Course = require('../models/course');
const CourseProgress = require('../models/courseProgress');
const Section = require('../models/section');
const User = require('../models/user');

exports.updateCourseProgress = async(req, res) => {
    try{
        const {courseId, subsectionId} = req.body;

        if(!courseId || !subsectionId ||
            !mongoose.isValidObjectId(courseId) ||
            !mongoose.isValidObjectId(subsectionId)){
            return res.status(400).json({
                success: false,
                message: 'Please provide valid course and subsection IDs',
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            studentEnrolled: req.user.id,
        }).select('courseContent');

        if(!course){
            return res.status(404).json({
                success: false,
                message: 'Enrolled course not found',
            });
        }

        const subsectionBelongsToCourse = await Section.exists({
            _id: {$in: course.courseContent},
            subSection: subsectionId,
        });

        if(!subsectionBelongsToCourse){
            return res.status(400).json({
                success: false,
                message: 'Subsection does not belong to this course',
            });
        }

        const user = await User.findById(req.user.id).select('courseProgress');
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const progressRecords = await CourseProgress.find({
            _id: {$in: user.courseProgress},
            courseId,
        }).select('_id');

        let progress;
        if(progressRecords.length){
            progress = await CourseProgress.findByIdAndUpdate(
                progressRecords[0]._id,
                {$addToSet: {completedVideos: subsectionId}},
                {new: true, runValidators: true},
            );
        } else {
            progress = await CourseProgress.create({
                courseId,
                completedVideos: [subsectionId],
            });
            await User.findByIdAndUpdate(req.user.id, {
                $addToSet: {courseProgress: progress._id},
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course progress updated successfully',
            data: progress,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating course progress',
            error: error.message,
        });
    }
}
