import nodemailer from 'nodemailer';
import "dotenv/config";


export const sendOtpMail=async(email,otp)=>{
    const transporter=nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const mailconfig={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"OTP for Password Reset",
        text:`Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    };
    await transporter.sendMail(mailconfig);
}