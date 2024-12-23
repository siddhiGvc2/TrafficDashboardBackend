
const {MacMapping,Testing} =require("../../Models")
import { successResponse, errorResponse, uniqueId } from '../../helpers';
var events = require('../../helpers/events')

export const getAllCommandOutputs=async(req,res)=>{
    try{
    
       
        const obj = await Testing.findAll();
         res.status(200).json({data:obj})

    }
    catch(err){
        console.log(err);
        res.status(505).json({status:505})

    }

}