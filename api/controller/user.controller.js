const errorHandler = require("../utils/error");
const bcrpyt = require('bcrypt');
const User=require('../models/user.model')
const Listing=require('../models/listing.model')
const jwt=require('jsonwebtoken');
const test=(req,res)=>{
    res.json({
        message:"Hello world!"
    })
}

const updateUser=async(req,res,next)=>{
   if(req.user.id!==req.params.id){
    return next(errorHandler(401,'You can only update your account'));
   }
   try{
    if(req.body.password){
        req.body.password=bcrpyt.hashSync(req.body.password,10);
    }
    const updateUser=await User.findByIdAndUpdate(req.params.id,{
        $set:{
           username:req.body.username,
           email:req.body.email,
           password:req.body.password,
           avatar:req.body.avatar
        }
    },{new:true});
    const{password,...rest}=updateUser._doc;
    res.status(200).json(rest);
   }
   catch(error){
    next(error);
   }
}
const deleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,"you can only delete your own account"));
    }
    try{
        await User.findByIdAndDelete(req.params.id);
        await Listing.deleteMany({userRef:req.params.id})
        res.clearCookie('access_token');
        res.status(200).json('User and associated listings has been deleted successfully')
    }
    catch(error){
        next(error);
    }
}

const getUserListings=async(req,res,next)=>{
 
        if(req.user.id!==req.params.id){
            return next(errorHandler(401,'You can only view your own listings'))
        }
        try{
            const listings=await Listing.find({userRef:req.params.id});
            res.status(200).json(listings);

        }
        catch(error){
            next(error);
        }
}
const getUser=async(req,res,next)=>{
    try{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(errorHandler(404,'User not found'))
    }
    const{password:pass,...rest}=user._doc;
    res.status(200).json(rest);
}
catch(error){
    return next(error);
}
}
const checkMe=async(req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,'Unauthorized'))
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'));
        res.json({message:'user is verified'});
    })
}
module.exports={test,updateUser,deleteUser,getUserListings,getUser,checkMe};