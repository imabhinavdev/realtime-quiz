import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    },
    role:{
        type:Number,
        default:"1"
    },

});

UserSchema.methods.generateRefreshToken=function(){
    const refreshToken=jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    this.refreshToken=refreshToken;
    return refreshToken;
}

UserSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id,name:this.name,email:this.email },process.env.JWT_SECRET,{
        expiresIn:"1h"
    });
    return token;
}

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
    }
    next();
});

UserSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}



export const UserModel=mongoose.models.User || mongoose.model("User", UserSchema);