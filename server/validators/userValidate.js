import yup from "yup";
import { registeruser } from "../controllers/usercontrollers.js";

export const userSchema = yup.object({
    username: yup.string().trim().min(3).required("Username is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
});
export const validateUser =  (schema)=> async (req,res,next)=>{
    try {
        await schema.validate(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            errors: err.errors,
        });
    }
}