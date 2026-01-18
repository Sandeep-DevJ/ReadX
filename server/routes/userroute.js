import express from "express";
import {
  registeruser,
  verification,
  loginuser,
  logoutuser,
  forgotPassword,
  verifyOtp,
  changePassword
} from "../controllers/usercontrollers.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateUser, userSchema } from "../validators/userValidate.js";

const router = express.Router();

// POST /api/user/register
router.post("/register", validateUser(userSchema), registeruser);

// GET /api/user/verify   (token in Authorization header)
router.get("/verify", verification);

// POST /api/user/login
router.post("/login", loginuser);

// POST /api/user/logout
router.post("/logout", isAuthenticated, logoutuser);

// POST /api/user/forgotPassword
router.post("/forgotPassword", forgotPassword);

// POST /api/user/verifyOtp/:email
router.post("/verifyOtp/:email", verifyOtp);

// POST /api/user/changePassword/:email
router.post("/changePassword/:email", changePassword);

export default router;