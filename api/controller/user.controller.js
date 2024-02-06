const errorHandler = require("../utils/error");
const bcrpyt = require('bcrypt');
const User=require('../models/user.model')
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
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted')
    }
    catch(error){
        next(error);
    }
}

module.exports={test,updateUser,deleteUser};