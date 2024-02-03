import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
dotenv.config();
const app=express();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})
  
app.listen(3000,()=>{
    console.log("service running at port 3000!!");
})