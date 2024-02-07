const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const userRouter=require('./routes/user.route')
const authRouter=require('./routes/auth.route')
const listRouter=require('./routes/listing.route')
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
app.use(cookieParser());
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listRouter)
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