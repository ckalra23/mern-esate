const express=require('express');
const router=express.Router();
const {test,updateUser,deleteUser}=require('../controller/user.controller')
const verifyToken =require('../utils/verifyToken')

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);

module.exports=router;

