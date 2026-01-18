import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    isverified: { type: Boolean, default: false },
    isloggedin: { type: Boolean, default: false },
    token:      { type: String, default: null },

    otp:        { type: String, default: null },
    otpExpiry:  { type: Date,   default: null }, // ✅ corrected name

    notes:      { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;