const User=require('../models/user.model')
const bcrpyt=require('bcrypt');
const errorHandler = require('../utils/error');
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv');
dotenv.config();
const signup=async(req,res,next)=>{
    try{
    const{username,email,password}=req.body;
    const hashedPassword= bcrpyt.hashSync(password,10);
    const newUser=await User.create({
        username,
        email,
        password:hashedPassword
    })
    res.status(201).json("User created successfully");
}
    catch(err){
        next(err);
    }

}
const signin=async(req,res,next)=>{
    try{
    const{email,password}=req.body;
    const validUser=await User.findOne({email})
    if(!validUser){
        return next(errorHandler(404,'User not found'))
    }
    const validPassword=bcrpyt.compareSync(password,validUser.password);
    if(!validPassword){
        return next(errorHandler(401,'Wrong credentials!'));
    }
    const token=jwt.sign({id:validPassword._id},process.env.JWT_SECRET);
    res.cookie('access_token',token,{httpOnly:true,expires:new Date(Date.now()+24*60*60*1000)})
    .status(200).json('Valid user');
    }
    catch(err){
        next(err); 
    }
}
module.exports={signup,signin}