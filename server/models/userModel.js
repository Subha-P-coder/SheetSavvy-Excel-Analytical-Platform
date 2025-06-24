import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, required:true,unique:true},
    password:{type: String, required:true},
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verifyOtp:{type: Number, default:''},
    verifyOtpExpiredAt:{type: Number, default:0},
    isAccountVerified:{type: Boolean, default:false},
    resetOtp:{type: Number, default:''},
    resetOtpExpiredAt:{type: Number, default:0}
})
const User = mongoose.model("user",userSchema);

export default User;