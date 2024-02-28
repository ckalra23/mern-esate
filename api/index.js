const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const userRouter=require('./routes/user.route')
const authRouter=require('./routes/auth.route')
const listRouter=require('./routes/listing.route')
const path=require('path');
const winston = require('winston');
dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      // You can add additional transports here, such as file or database transports
    ],
  });

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

const app=express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000,()=>{
    console.log("service running at port 3000!!");
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listRouter)
app.use(express.static(path.join(__dirname,'..','client','dist')));
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
    logger.info(`Serving index.html from path: ${indexPath}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        logger.error(`Error serving index.html: ${err.message}`);
        res.status(500).send('Internal Server Error');
      }
    });
  });
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

