import User from "../models/user.js";
import bcrypt from "bcryptjs";
import session from "../models/sessionModel.js";
import jwt from "jsonwebtoken";
import { verifyMail } from "../emailverify/verifyMail.js";
import { sendOtpMail } from "../emailverify/sendOtpMail.js";

// REGISTER
export const registeruser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // already verified → block
      if (existingUser.isverified) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // NOT verified → resend verification email with a fresh token
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "10m" }
      );
      existingUser.token = token;
      await existingUser.save();

      await verifyMail(token, existingUser.email);

      return res.status(200).json({
        success: true,
        message:
          "Account already registered but not verified. A new verification link has been sent to your email.",
      });
    }

    // New user
    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isverified: false,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    newUser.token = token;
    await newUser.save();

    await verifyMail(token, email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EMAIL VERIFICATION
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Token has expired" });
      }
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.token = null;
    user.isverified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// LOGIN
export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "unautrhorized to access",
      });
    }

    const passwordcheck = await bcrypt.compare(password, user.password);
    if (!passwordcheck) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isverified !== true) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email to login",
      });
    }

    const existingSession = await session.findOne({ userId: user._id });
    if (existingSession) {
      await session.deleteOne({ userId: user._id });
    }
    await session.create({ userId: user._id });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "2d" }
    );

    user.isloggedin = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Login successful ${user.username}`,
      data: { accessToken, refreshToken, user },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGOUT
export const logoutuser = async (req, res) => {
  try {
    const userId = req.userId;
    await session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isloggedin: false });
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// FORGOT PASSWORD (send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;   // matches schema
    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found",
      });
    }

    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};