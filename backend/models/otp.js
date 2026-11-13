const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender')
const {verificationOtp} = require('../utils/emailTemplates');

const otpSchema = new mongoose.Schema({
   email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
   },
   createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
   },
   otp: {
        type: String,
        required: true,
   },
});

//function to send mails
const sendVerificationEmail = async(email, otp) => {
    try{
        await mailSender(
            email,
            "Verify your email | StudyNotion",
            verificationOtp(otp),
        );
        // console.log("Email sent Successfully", mailResponse);

    } catch(error){
        console.log(`Error occured while sending mail: `, error);
        throw error;
    }
}

otpSchema.pre("save", async function(){
    await sendVerificationEmail(this.email, this.otp);
})

module.exports = mongoose.model("OTP", otpSchema);