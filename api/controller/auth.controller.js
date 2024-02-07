const User = require('../models/user.model')
const bcrpyt = require('bcrypt');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcrpyt.hashSync(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(201).json("User created successfully");
    }
    catch (err) {
        next(err);
    }

}
const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcrpyt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong credentials!'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const{password:pass,...rest}=validUser._doc
        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        res.
            cookie('access_token', token, { httpOnly: true,expires: expirationDate})
            .status(200).
            json(rest);
    }
    catch (err) {
        next(err);
    }
}

const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email});
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const{password:pass,...rest}=user._doc;
            const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            res.
            cookie('access_token',token,{httpOnly:true,expires:expirationDate})
            .status(200)
            .json(rest);
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcrpyt.hashSync(generatedPassword,10);
            const newUser=await User.create({
                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo,
            })
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass,...rest}=newUser._doc;
            const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            res.cookie('access_token',token,{httpOnly:true,expires:expirationDate})
            .status(200)
            .json(rest);

        }
    }
    catch(error){
        next(error)
    }
}

const signout=(req,res,next)=>{
try{
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
}
catch(error){
    next(error);
}
}
module.exports = { signup, signin ,google,signout}