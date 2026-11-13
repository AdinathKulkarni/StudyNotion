const crypto = require('crypto');
const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const {passwordReset} = require('../utils/emailTemplates');

exports.resetPasswordToken = async(req, res) => {
    try{
        //get email
        const {email} = req.body;
        if(typeof email !== 'string' || !email.trim()){
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        //validation
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({email: normalizedEmail});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //generate token and update in user model
        const token = crypto.randomUUID();
        await User.findOneAndUpdate(
            {email: normalizedEmail},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            {new: true},
        );

        //create link with token and send to user via mail
        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000')
            .replace(/\/$/, '');
        const url = `${frontendUrl}/update-password/${token}`;
        await mailSender(
            normalizedEmail,
            "Reset your password | StudyNotion",
            passwordReset(url),
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

        if(
            typeof password !== 'string' ||
            !password ||
            typeof confirmPassword !== 'string' ||
            !confirmPassword ||
            typeof token !== 'string' ||
            !token
        ){
            return res.status(400).json({
                success: false,
                message: "Please provide a reset token and both passwords",
            });
        }

        //if both doesnt match, then return
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords donot match, Please enter matching passwords",
            });
        }

        //get the user on basis of token 
        const userDetails = await User.findOne({token: token});
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Token is invalid, Please generate a new token",
            });
        }

        //Here the token expiry is 5mins, if the generted token is older than 5 mins then return 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(410).json({
                success: false,
                message: "Token is expired, Please generate a new token",
            })
        }

        //if token is valid, then hash the new pasword and store in DB
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {token: token},
            {
                $set: {
                    password: hashedPassword,
                    token: null,
                    resetPasswordExpires: null,
                }
            },
            { returnDocument: 'after' },
        )

        return res.status(203).json({
            success: true,
            message: "Password Updated successfully",
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while reseting the password, Please try again.",
        });
    }

}