const { sequelize,batteryTransactions,batteries} =require('../../Models')
// import { Transaction } from "sequelize";
// import {batteryTransactions,sequi} from "../../Models/batteryTransactions"
 const getAllTransaction=async(req,res)=>{
    try{
    
      
        const transactions = await batteryTransactions.findAll();
         res.status(200).json(transactions)

    }
    catch(err){
        console.log(err);
        res.status(505).json(err)

    }

}
 const getAllBatteries=async(req,res)=>{
    try{
    
      
        const battery = await batteries.findAll();
         res.status(200).json({data:battery})

    }
    catch(err){
        console.log(err);
        res.status(505).json(err)

    }

}
 const getData=async(req,res)=>{
  try {
    var replObjG = {};
    if (req.query.city) replObjG['city'] = req.query.city.split(',');
    if (req.query.zone) replObjG['zone'] = req.query.zone.split(',');
    if (req.query.ward) replObjG['ward'] = req.query.ward.split(',');
    if (req.query.beat) replObjG['beat'] = req.query.beat.split(',');

    if (!req.user.isAdmin && replObjG['city'] && req.user.city)
      replObjG['city'] = replObjG['city'].filter(q => req.user.city.split(',').indexOf(q) >= 0);
    else if (!req.user.isAdmin && !replObjG['city'] && req.user.city)
      replObjG['city'] = req.user.city.split(',');
    if (!req.user.isAdmin && replObjG['zone'] && req.user.zone)
      replObjG['zone'] = replObjG['zone'].filter(q => req.user.zone.split(',').indexOf(q) >= 0);
    else if (!req.user.isAdmin && !replObjG['zone'] && req.user.zone)
      replObjG['zone'] = req.user.zone.split(',');
    if (!req.user.isAdmin && replObjG['ward'] && req.user.ward)
      replObjG['ward'] = replObjG['ward'].filter(q => req.user.ward.split(',').indexOf(q) >= 0);
    else if (!req.user.isAdmin && !replObjG['ward'] && req.user.ward)
      replObjG['ward'] = req.user.ward.split(',');
    if (!req.user.isAdmin && replObjG['beat'] && req.user.beat)
      replObjG['beat'] = replObjG['beat'].filter(q => req.user.beat.split(',').indexOf(q) >= 0);
    else if (!req.user.isAdmin && !replObjG['beat'] && req.user.beat)
      replObjG['beat'] = req.user.beat.split(',');

    var replObj = { machine_status: req.query.status.split(',') };
    if (req.query.stock_status) replObj['stock_status'] = req.query.stock_status.split(',');
    if (req.query.burn_status) replObj['burn_status'] = req.query.burn_status.split(',');
    const [objAll, _metadata] = await sequelize.query(`
      select a.* from batteriesData a
      left join batteries b on a.machineId = b.id
      where 1 = 1
      ${replObjG.city ? ` and b.data1 in (:city)` : ''}
      ${replObjG.zone ? ` and b.zone in (:zone)` : ''}
      ${replObjG.ward ? ` and b.ward in (:ward)` : ''}
      ${replObjG.beat ? ` and b.beat in (:beat)` : ''}
    `, { replacements: replObjG });
    const [obj, metadata] = await sequelize.query(`
      select a.* from batteriesData a
      left join batteries b on a.machineId = b.id
      where a.machine_status in (:machine_status)
     
      ${replObjG.city ? ` and b.data1 in (:city)` : ''}
      ${replObjG.zone ? ` and b.zone in (:zone)` : ''}
      ${replObjG.ward ? ` and b.ward in (:ward)` : ''}
      ${replObjG.beat ? ` and b.beat in (:beat)` : ''}
  `, { replacements: Object.assign(replObj, replObjG) });
    return successResponse(req, res, { data: obj, dataAll: objAll });
  } catch (error) {
    console.log(error)
    return errorResponse(req, res, error.message);
  }

}

 const getZones = async (req, res) => {
    try {
      const [obj, metadata] = await sequelize.query(`
        select distinct zone from batteries where city in (:city) order by zone;
      `, {
        replacements: {
          city: req.query.city.split(',')
        },
      });
      var respObj = obj.map(q => q.zone);
      if (!req.user.isAdmin && req.user.zone)
        respObj = respObj.filter(q => req.user.zone.split(',').indexOf(q) >= 0)
      return successResponse(req, res, respObj);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  };
  
   const getWards = async (req, res) => {
    try {
      const [obj, metadata] = await sequelize.query(`
        select distinct ward from batteries where data1 in (:city) and zone in (:zone) order by ward;
      `, {
        replacements: {
          city: req.query.city.split(','),
          zone: req.query.zone.split(','),
        },
      });
      var respObj = obj.map(q => q.ward);
      if (!req.user.isAdmin && req.user.ward)
        respObj = respObj.filter(q => req.user.ward.split(',').indexOf(q) >= 0)
      return successResponse(req, res, respObj);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  };
  
 const getBeats = async (req, res) => {
    try {
      const [obj, metadata] = await sequelize.query(`
        select distinct beat from batteries where data1 in (:city) and zone in (:zone) and ward in (:ward) order by beat;
      `, {
        replacements: {
          city: req.query.city.split(','),
          zone: req.query.zone.split(','),
          ward: req.query.ward.split(','),
        },
      });
      return successResponse(req, res, obj.map(q => q.beat));
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  };
  
 const getMachines = async (req, res) => {
    try {
      const [obj, metadata] = await sequelize.query(`
        select distinct uid,serial from batteries where data1 in (:city) and zone in (:zone) and ward in (:ward) and beat in (:beat) order by uid;
      `, {
        replacements: {
          city: req.query.city.split(','),
          zone: req.query.zone.split(','),
          ward: req.query.ward.split(','),
          beat: req.query.beat.split(','),
        },
      });
      return successResponse(req, res, obj.map(q => { return { label: q.uid + ' (' + q.device_number + ')', value: q.device_number } }));
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  };


  module.exports={getBeats,getWards,getZones,getData,getMachines,getAllTransaction,getAllBatteries}