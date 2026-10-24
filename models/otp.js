const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
   email: {
        type: String,
        required: true,
   },
   createdAt: {
        type: Date,
        default: Date.now(),
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
        const mailResponse = await mailSender(email, "Verification email from Study Notion", otp);
        console.log("Email sent Successfully", mailResponse);

    } catch(error){
        console.log(`Error occured while sending mail: `, error);
        throw error;
    }
}

otpSchema.pre("save", async function(next){
    await senderVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);