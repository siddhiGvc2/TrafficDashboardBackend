import { where } from "sequelize";

const {TrafficMacMapping,TestMode,SerialPort} =require("../../Models")
import { successResponse, errorResponse, uniqueId } from '../../helpers';
var events = require('../../helpers/events')

export const getAllMacAddress=async(req,res)=>{
    try{
    
       
        const obj = await TrafficMacMapping.findAll();
         res.status(200).json({data:obj})

    }
    catch(err){
        console.log(err);
        res.status(505).json({status:505})

    }

}


export const getData=async(req,res)=>{
    try {
      var replObjG = {};
      if (req.query.city) replObjG['city'] = req.query.city.split(',');
    //   if (req.query.zone) replObjG['zone'] = req.query.zone.split(',');
    //   if (req.query.ward) replObjG['ward'] = req.query.ward.split(',');
    //   if (req.query.beat) replObjG['beat'] = req.query.beat.split(',');
    //   if (req.query.status) replObjG['machine_status'] = req.query.status.split(',');
    //   if (req.query.voltage) replObjG['Voltage'] = req.query.voltage.split(',');
    //   if (req.query.current) replObjG['Current'] = req.query.current.split(',');
    //   if (req.query.temperature) replObjG['Temperature'] = req.query.temperature.split(',');
    //   if(req.query.voltage){
    //     console.log(req.query.voltage);
    //   }
      // if (!req.user.isAdmin && replObjG['city'] && req.user.city)
      //   replObjG['city'] = replObjG['city'].filter(q => req.user.city.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['city'] && req.user.city)
      //   replObjG['city'] = req.user.city.split(',');
      // if (!req.user.isAdmin && replObjG['zone'] && req.user.zone)
      //   replObjG['zone'] = replObjG['zone'].filter(q => req.user.zone.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['zone'] && req.user.zone)
      //   replObjG['zone'] = req.user.zone.split(',');
      // if (!req.user.isAdmin && replObjG['ward'] && req.user.ward)
      //   replObjG['ward'] = replObjG['ward'].filter(q => req.user.ward.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['ward'] && req.user.ward)
      //   replObjG['ward'] = req.user.ward.split(',');
      // if (!req.user.isAdmin && replObjG['beat'] && req.user.beat)
      //   replObjG['beat'] = replObjG['beat'].filter(q => req.user.beat.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['beat'] && req.user.beat)
      //   replObjG['beat'] = req.user.beat.split(',');
  
      var replObj = {
         city: req.query.city.split(',') ,
        //  zone: req.query.zone.split(',') ,
        //  ward: req.query.ward.split(',') ,
        //  beat: req.query.beat.split(',') ,
        //  machine_status:req.query.status.split(','),
        //  Voltage:req.query.voltage.split(','),
        //  Current:req.query.current.split(','),
        //  Temperature:req.query.temperature.split(',')
  
        };
      // if (req.query.stock_status) replObj['stock_status'] = req.query.stock_status.split(',');
      // if (req.query.burn_status) replObj['burn_status'] = req.query.burn_status.split(',');

    //   const obj=await TrafficMacMapping.findAll({where:{city:}})
      const [obj, _metadata] = await sequelize.query(
        `
        select * FROM TrafficMacMapping
        ${replObjG.city ? 'whrere City in (:city)' : ''}
        `,
        { replacements: { city: replObjG.city } }
      );
      
    
      return successResponse(req, res, { data: obj});
    } catch (error) {
      console.log(error)
      return errorResponse(req, res, error.message);
    }
  
  }




export const sendFota=async(req,res)=>{
    try{
        console.log(req.body);
        const output=req.body.outPutValue;
        events.pubsub.emit('sendFota',output,req.body.socketNumber,req.body.UserName,req.body.type) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendReset=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendReset',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}





export const sendFW=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendFW',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }


}


export const sendFotaUrl=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendFotaUrl',req.body.socketNumber,req.body.Url,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const askUrl=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askUrl',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setSN=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setSN',req.body.socketNumber,req.body.UserName,req.body.SerialNumber) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const setErase=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setErase',req.body.socketNumber,req.body.UserName,req.body.Erase) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}


export const checkErase=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkErase',req.body.socketNumber) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}



export const checkSN=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkSN',req.body.socketNumber) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}





export const sendHBT=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendHBT',req.body.socketNumber,req.body.value,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}



export const sendSIP=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSIP',req.body.socketNumber,req.body.Ip,req.body.Pin,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const askSIP=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askSIP',req.body.socketNumber) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendSSID=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSSID',req.body.socketNumber,req.body.SSID,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const askSSID=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askSSID',req.body.socketNumber) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}



export const sendPWD=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendPWD',req.body.socketNumber,req.body.PWD,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendSSID1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSSID1',req.body.socketNumber,req.body.SSID1,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendPWD1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendPWD1',req.body.socketNumber,req.body.PWD1,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest1',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest2=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest2',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest3=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest3',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeNone=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeNone',req.body.socketNumber,req.body.UserName) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const getTestMode=async(req,res)=>{
    try{
        
        const obj = await TestMode.findAll();
       
        res.status(200).json({data:obj[0]})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setTestMode=async(req,res)=>{
    try{
        
        const obj = await TestMode.findOne({where:{id:1}});

        obj.testMode=!obj.testMode;

        obj.save();
       
        res.status(200).json()
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const getSerialPorts=async(req,res)=>{
    try{
       
        const obj = await SerialPort.findAll();
       
        res.status(200).json({data:obj[0]})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendMessage=async(req,res)=>{
    try{
        console.log(req.body);
    
        events.pubsub.emit('sendMessage',req.body.socketNumber,req.body.message) ;
        const obj = await TrafficMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}


