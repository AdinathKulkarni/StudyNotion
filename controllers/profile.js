const Profile = require('../models/profile');
const User = require('../models/user');
const Course = require('../models/course');
const {uploadToCloudinary} = require('../utils/imageUploader');

exports.getEnrolledCourses = async(req, res) => {
    try{
        const courses = await Course.find({studentEnrolled: req.user.id})
            .populate('instructor', 'firstName lastName')
            .populate('category')
            .populate({
                path: 'courseContent',
                populate: {path: 'subSection'},
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Enrolled courses fetched successfully',
            data: courses,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching enrolled courses',
            error: error.message,
        });
    }
}

exports.updateDisplayPicture = async(req, res) => {
    try{
        const displayPicture = req.files && req.files.displayPicture;

        if(!displayPicture){
            return res.status(400).json({
                success: false,
                message: 'Please provide a display picture',
            });
        }

        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const uploadedPicture = await uploadToCloudinary(displayPicture, process.env.FOLDER_NAME);
        user.image = uploadedPicture.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Display picture updated successfully',
            data: {
                image: user.image,
            },
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating display picture',
            error: error.message,
        });
    }
}

exports.instructorDashboard = async(req, res) => {
    try{
        const courses = await Course.find({instructor: req.user.id})
            .populate('ratingAndReviews', 'rating')
            .lean()
            .exec();

        let totalStudentsEnrolled = 0;
        let totalRevenue = 0;

        const courseSummaries = courses.map((course) => {
            const studentCount = course.studentEnrolled.length;
            const ratings = course.ratingAndReviews;

            totalStudentsEnrolled += studentCount;
            totalRevenue += (course.price || 0) * studentCount;

            return {
                ...course,
                totalStudentsEnrolled: studentCount,
                averageRating: ratings.length
                    ? ratings.reduce((total, review) => total + review.rating, 0) / ratings.length
                    : 0,
            };
        });

        return res.status(200).json({
            success: true,
            message: 'Instructor dashboard fetched successfully',
            data: {
                courses: courseSummaries,
                totalCourses: courses.length,
                totalStudentsEnrolled,
                totalRevenue,
            },
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching instructor dashboard',
            error: error.message,
        });
    }
}

exports.updateProfile = async(req, res) => {
    try{

        const {dob, about, contactNumber, gender} = req.body;
        const id = req.user && req.user.id;

        if(!id || dob === undefined || about === undefined ||
            contactNumber === undefined || gender === undefined){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let profileDetails = userDetails.additionalDetails
            ? await Profile.findById(userDetails.additionalDetails)
            : null;

        if(!profileDetails){
            profileDetails = await Profile.create({});
            userDetails.additionalDetails = profileDetails._id;
            await userDetails.save();
        }

        profileDetails.dob = dob;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating your profile",
            error: error.message,
        })
    }
}

exports.deleteAccount = async(req, res) => {
    try{

        const id = req.user.id;

        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found !!",
            });
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting the account",
            error: error.message,
        })
    }
}

exports.getAllUserDetails = async(req, res) => {
    try{

        const id = req.user.id;
        const userDetails = await User.findById(id)
                                      .populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            userDetails,
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}