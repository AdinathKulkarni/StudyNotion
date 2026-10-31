const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async(req, res, next) => {
    try{
        const authorization = req.get("Authorization");
        const token = (req.cookies && req.cookies.token)
            || (req.body && req.body.token)
            || (authorization && authorization.startsWith("Bearer ")
                ? authorization.slice(7)
                : null);
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                ...decode,
                accountType: decode.accountType || decode.role,
            };
        } catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            })
        }
        next();

    } catch(error){
        console.log("Something went wrong while validating the user", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the user",
        });
    }
}

exports.isStudent = async(req, res, next) => {
    try{
       if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success: false,
            message: "This is a protected route for Students only"
        });
       }
       next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Couldnot verify student role",
        })
    }
}

exports.isInstructor = async(req, res, next) => {
    try{
       if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success: false,
            message: "This is a protected route for Instructors only"
        });
       }
       next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Couldnot verify Instructor role",
        })
    }
}

exports.isAdmin = async(req, res, next) => {
    try{
       if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success: false,
            message: "This is a protected route for Admin only"
        });
       }
       next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Couldnot verify Admin role",
        })
    }
}