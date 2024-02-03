const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const User=require('./models/user.model');
const userRouter=require('./routes/user.route')
dotenv.config();
const app=express();
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

app.use('/api/user',userRouter)

app.listen(3000,()=>{
    console.log("service running at port 3000!!");
})