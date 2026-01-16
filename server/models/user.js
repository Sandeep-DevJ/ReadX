import mongoose from 'mongoose';

const userschema=new mongoose.Schema({
    username:{type:String ,required:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String ,required:true},
    isverified:{type:Boolean ,default:false},
    isloggedin:{type:Boolean ,default:false},
    token:{type:String ,default:null},
    otp:{type:String ,default:null},
    otpexpiry:{type:Date,default:null},
    notes: { type: String, default: '' }

},{timestamps:true}
)
export const User=mongoose.model('User',userschema)
export default User;