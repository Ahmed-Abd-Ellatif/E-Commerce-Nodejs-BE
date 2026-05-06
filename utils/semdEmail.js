const nodeMailer = require("nodemailer");

// SEND EMAIL
sendEmail = async (options) => {
    // 1. Create transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // if secure is false, use port 587 , if secure is true, use port 465
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `TeFactory <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;