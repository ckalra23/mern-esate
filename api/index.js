const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const User=require('./models/user.model');
const userRouter=require('./routes/user.route')
const authRouter=require('./routes/auth.route')
dotenv.config();
const app=express();
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)

//middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message||'Internal server error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(3000,()=>{
    console.log("service running at port 3000!!");
})