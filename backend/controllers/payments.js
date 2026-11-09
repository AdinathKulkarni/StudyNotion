const crypto = require('crypto');
const mongoose = require('mongoose');
const {instance} = require('../config/razorpay');
const Course = require('../models/course');

const MAX_COURSES_PER_ORDER = 10;

exports.capturePayment = async(req, res) => {
    try{
        const requestedCourses = Array.isArray(req.body.courses)
            ? req.body.courses
            : (req.body.course_id ? [req.body.course_id] : []);
        const courseIds = [...new Set(requestedCourses)];

        if(!courseIds.length ||
            courseIds.length > MAX_COURSES_PER_ORDER ||
            courseIds.some((id) => !mongoose.isValidObjectId(id))){
            return res.status(400).json({
                success: false,
                message: `Please provide between 1 and ${MAX_COURSES_PER_ORDER} valid course IDs`,
            });
        }

        const courses = await Course.find({
            _id: {$in: courseIds},
            status: 'Published',
        });
        if(courses.length !== courseIds.length){
            return res.status(404).json({
                success: false,
                message: 'One or more courses are unavailable for purchase',
            });
        }

        if(courses.some((course) =>
            course.studentEnrolled.some((studentId) =>
                studentId.toString() === req.user.id
            )
        )){
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in one or more selected courses',
            });
        }

        const amount = courses.reduce((total, course) => {
            const price = Number(course.price);
            return total + (Number.isFinite(price) && price > 0 ? price : 0);
        }, 0);
        if(amount <= 0){
            return res.status(400).json({
                success: false,
                message: 'The selected courses have an invalid purchase amount',
            });
        }

        const order = await instance.orders.create({
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: crypto.randomBytes(12).toString('hex'),
            notes: {
                userId: req.user.id,
                courseIds: courseIds.join(','),
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Payment order created successfully',
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY,
            },
        });
    } catch(error) {
        console.error('Could not create payment order:', error);
        return res.status(500).json({
            success: false,
            message: 'Could not initiate payment',
        });
    }
};

exports.verifySignature = async(req, res) => {
    try{
        const {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
        } = req.body;
        const secret = process.env.RAZORPAY_SECRET;

        if(typeof orderId !== 'string' ||
            typeof paymentId !== 'string' ||
            typeof signature !== 'string' ||
            !/^[a-f\d]{64}$/i.test(signature) ||
            !secret){
            return res.status(400).json({
                success: false,
                message: 'Payment verification details are incomplete',
            });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        const providedSignature = Buffer.from(signature, 'hex');
        const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
        if(providedSignature.length !== expectedSignatureBuffer.length ||
            !crypto.timingSafeEqual(providedSignature, expectedSignatureBuffer)){
            return res.status(400).json({
                success: false,
                message: 'Payment signature is invalid',
            });
        }

        const [order, payment] = await Promise.all([
            instance.orders.fetch(orderId),
            instance.payments.fetch(paymentId),
        ]);
        if(order.notes.userId !== req.user.id ||
            payment.order_id !== orderId ||
            payment.amount !== order.amount ||
            payment.currency !== order.currency){
            return res.status(400).json({
                success: false,
                message: 'Payment details do not match this order',
            });
        }

        let capturedPayment = payment;
        if(payment.status === 'authorized'){
            capturedPayment = await instance.payments.capture(
                paymentId,
                payment.amount,
                payment.currency,
            );
        }
        if(capturedPayment.status !== 'captured'){
            return res.status(400).json({
                success: false,
                message: 'Payment has not been captured',
            });
        }

        const courseIds = (order.notes.courseIds || '').split(',').filter(Boolean);
        if(!courseIds.length ||
            courseIds.length > MAX_COURSES_PER_ORDER ||
            courseIds.some((id) => !mongoose.isValidObjectId(id))){
            return res.status(400).json({
                success: false,
                message: 'The order does not contain valid course details',
            });
        }

        const result = await Course.updateMany(
            {_id: {$in: courseIds}},
            {$addToSet: {studentEnrolled: req.user.id}},
        );
        if(result.matchedCount !== courseIds.length){
            return res.status(500).json({
                success: false,
                message: 'Payment was captured, but one or more courses could not be enrolled',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified and enrollment completed',
        });
    } catch(error) {
        console.error('Could not verify payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to verify payment',
        });
    }
};
