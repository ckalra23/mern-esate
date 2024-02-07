const Listing=require('../models/listing.model')
const createListing=async(req,res,next)=>{
    try{
        const newListing=await Listing.create(req.body);
        return res.status(201).json(newListing);
    }
    catch(error){
        next(error);
    }
}
module.exports={createListing};