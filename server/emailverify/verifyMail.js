import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, userEmail) => {
  try {
    const templatePath = path.join(__dirname, "template.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");

    const template = Handlebars.compile(templateSource);
    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailconfig = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Verify Your Email",
      html: htmlToSend,
    };

    const info = await transporter.sendMail(mailconfig);
    console.log("Email sent successfully:", info.response);

  } catch (error) {
    console.error("verifyMail error:", error);
    throw error; // IMPORTANT
  }
};
