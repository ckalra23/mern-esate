const User=require('../models/user.model')
const bcrpyt=require('bcrypt')
const signup=async(req,res)=>{
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
        res.status(500).json(err.message);
    }

}
module.exports=signup