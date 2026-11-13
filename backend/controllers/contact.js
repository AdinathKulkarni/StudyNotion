const mailSender = require('../utils/mailSender');
const {contactMessage} = require('../utils/emailTemplates');

exports.contactUs = async(req, res) => {
    const {firstname, lastname = '', email, countrycode = '', phoneNo, message} = req.body;
    if(
        typeof firstname !== 'string' ||
        typeof email !== 'string' ||
        typeof phoneNo !== 'string' && typeof phoneNo !== 'number' ||
        typeof message !== 'string' ||
        typeof countrycode !== 'string' ||
        typeof lastname !== 'string' ||
        !firstname.trim() ||
        !email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        !String(phoneNo).trim() ||
        !message.trim()
    ){
        return res.status(400).json({
            success: false,
            message: 'Please provide your name, email, phone number, and message',
        });
    }

    const recipient = process.env.MAIL_USER;
    if(!recipient){
        return res.status(500).json({
            success: false,
            message: 'Contact form email is not configured',
        });
    }

    const fullName = `${firstname.trim()} ${typeof lastname === 'string' ? lastname.trim() : ''}`.trim();
    const phone = `${countrycode} ${phoneNo}`.trim();

    try{
        await mailSender(
            recipient,
            `New website message | StudyNotion`,
            contactMessage({
                name: fullName,
                email: email.trim(),
                phone,
                message: message.trim(),
            }),
            {replyTo: email.trim()},
        );

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully',
        });
    } catch(error){
        console.error('Unable to send contact form message:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to send your message right now',
        });
    }
};
