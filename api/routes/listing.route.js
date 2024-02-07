const express=require('express');
const router=express.Router();
const{createListing}=require('../controller/listing.controller')
const verifyToken=require('../utils/verifyToken')
router.post('/create',verifyToken,createListing);
module.exports=router;