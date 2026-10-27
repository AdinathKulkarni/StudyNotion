const Profile = require('../models/profile');
const User = require('../models/user');

exports.updateProfile = async(req, res) => {
    try{

        const {dob="", about="", contactNumber, gender} = req.body;

        const id = req.user.id;

        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        await profileDetails.save();

        return res.status(203).json({
            success: true,
            message: "Profile updated successfully",
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
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}