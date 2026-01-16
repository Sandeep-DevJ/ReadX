import express from "express";
import { registeruser,verification,loginuser,logoutuser,forgotPassword ,verifyOtp,changePassword} from "../controllers/usercontrollers.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateUser, userSchema } from "../validators/userValidate.js";
const router = express.Router();

router.post("/register", validateUser(userSchema), registeruser);
router.post("/verify", verification);
router.post("/login", loginuser );
router.post("/logout", isAuthenticated, logoutuser);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp/:email", verifyOtp);
router.post("/changepassword/:email", changePassword);

export default router;
