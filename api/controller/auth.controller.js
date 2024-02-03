const User=require('../models/user.model')
const bcrpyt=require('bcrypt');
const errorHandler = require('../utils/error');
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
module.exports=signup