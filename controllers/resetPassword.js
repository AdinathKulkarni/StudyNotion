const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

exports.resetPasswordToken = async(req, res) => {
    try{
        //get email
        const {email} = req.body;

        //validation
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //generate token and update in user model
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            {new: true},
        );

        //create link with token and send to user via mail
        const url = `https://localhost:3000/reset-password/${token}`;
        await mailSender(email, 
            "Password Reset - Study Notion",
            `Password reset link - ${url}`,
        );

        return res.json({
            success: true,
            message: "Password reset link sent successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error generating password reset token",
        })
    }
}

exports.resetPassword = async(req, res) => {

    try{
        //get the passwords from req
        const {password, confirmPassword, token} = req.body;

        //if both doesnt match, then return
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Passwords donot match, Please enter matching passwords",
            });
        }

        //get the user on basis of token 
        const userDetails = await user.findOne({token: token});
        if(!userDetails){
            return res.json({
                success: false,
                message: "Token is invalid, Please generate a new token",
            });
        }

        //Here the token expiry is 5mins, if the generted token is older than 5 mins then return 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired, Please generate a new token",
            })
        }

        //if token is valid, then hash the new pasword and store in DB
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true},
        )
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while reseting the password, Please try again.",
        });
    }

}