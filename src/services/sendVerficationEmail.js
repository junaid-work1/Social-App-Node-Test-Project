import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailVerification = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: `"Test Project" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <p>Thank you for registering with us!</p>
        <p>Please click on the following link to verify your email address:</p>
        <p><a href="http://localhost:5000/v1/verify-email/${verificationCode}">Verify email address</a></p>
      `,
    });

    console.log("Email sent.");
  } catch (error) {
    console.error("Error sending email: " + error);
  }
};
