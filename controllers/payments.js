const {instance} = require('../config/razorpay');
const Course = require('../models/course');
const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const mongoose = require('mongoose');

exports.capturePayment = async(req, res) => {
    try{

        //get courseId and userId
        const {course_id} = req.body;
        const userId = req.user.id;

        //validation
        //valid courseId
        if(!course_id){
            return res.status(400).json({
                success: false,
                message: 'Please provide valid course Id',
            });
        }

        let course;
        try{
            course = await Course.find(course_id);
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: "Unable to find the course",
                });
            }

             //already paid
            const uId = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uId)){
                return res.status(400).json({
                    success: false,
                    message: "Student is already enrolled in this course",
                })
            }
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        
        //create order
        const amount = course.price;
        const currency = 'INR';

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId, 
            }
        }

       try{

            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json({
                success: true,
                message: "Payment successfull",
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbmail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            })

       } catch(error){
            return res.status(500).json({
                success: false,
                message: "Could not initiate payment",
                error: error.message,
            })
       }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to capture payment",
            error: error.message,
        })
    }
}

exports.verifySignature = async(req, res) => {
    try{

        const webHookSecret = "1234567";
        const razorpaySecret = req.headers("x-razorpay-signature");

        const shaSum = crypto.createHmac("sha256", webHookSecret);
        shaSum.update(JSON.stringify(req.body));
        const digest = shaSum.digest("hex");

        if(signature === digest) {
            console.log("Payment is authorized");

            const {courseId, userId} = req.body.payload.payment.entity.notes;

            try{
                //find teh course - so enroll student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                    {_id: courseId},
                    {$push: {studentEnrolled: userId}},
                    {new: true},
                );

                if(!enrolledCourse){
                    return res.status(500).json({
                        success: false,
                        message: "Unable to find course",
                        error: error.message,
                    })
                }

                console.log(enrolledCourse);

                const enrolledStudent = await User.findOneAndUpdate(
                    {_id: userId},
                    {$push: {studentEnrolled: courseId}},
                    {new: true},
                );

                 console.log(enrolledStudent);

                 //send mail
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations from StudyNotion",
                    "You are now enrolled in StudyNotion course",

                );

                return res.status(200).json({
                    success: true,
                    message: "Signature Verification successfull",
                })

            } catch(error) {
                return res.status(500).json({
                    success: false,
                    error: error.message,
                })
            }
        }

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to verify signature, Please try again",
            error: error.message,
        });
    }
}