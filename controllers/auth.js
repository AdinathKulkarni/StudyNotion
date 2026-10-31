const User = require('../models/user');
const OTP = require('../models/otp');
const otpGenerator = require('otp-generator');
const Profile = require('../models/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//send otp
exports.sendOTP = async(req, res) => {
    try{
        const email = req.body.email && req.body.email.trim().toLowerCase();
        if(!email){
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        //check if user is already present or not
        const isUserAlreadyExists = await User.findOne({email});

        if(isUserAlreadyExists){
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let result = await OTP.findOne({otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp});
        }

        const otpPayload = {email, otp};

        await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch(error){
        console.log("Error sending OTP", error);
        return res.status(500).json({
            success: false,
            message: "Error generating OTP, Pls try again !!",
        });
    }
}

exports.signUp = async(req, res) => {

    try{

        //get the payload from frontend
        const {firstName, 
            lastName, 
            email, 
            password, 
            confirmPassword, 
            accountType, 
            contactNumber, 
            otp} = req.body;

        if( !firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: 'Please fill all the fields'
            });
        }

        if( password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password doesnot match with confirmPassword, please try again !!"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({email: normalizedEmail});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists, Please login",
            });
        }

        //get the most recent otp from teh db
        const recentOtp = await OTP.findOne({email: normalizedEmail})
            .sort({createdAt: -1});

        if(!recentOtp){
            return res.status(404).json({
                success: false,
                message: "Otp not found",
            });
        } else if(String(otp) !== recentOtp.otp){
            return res.status(400).json({
                success: false,
                message: "Otp doesnot match",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email: normalizedEmail,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        })

    } catch(error){
        // console.log("Error occured while signing you up", error);
        return res.status(500).json({
            success: false,
            message: "Error while signing you up",
            error: error.message,
        })
    }
}

exports.login = async(req, res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found, Please signup",
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            user.token = token;
            const userDetails = user.toObject();
            delete userDetails.password;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }

            res.cookie("token", token, options).json({
                success: true,
                token,
                user: userDetails,
                message: "Login successfull",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            });
        }
    } catch(error){
        console.log("Error while login in, Pls try again" , error);
        res.status(400).json({
            success: false,
            message: "Error while logging in, Pls try again"
        });
    }
}