const { successResponse, errorResponse, uniqueId }=require('../../helpers');
const { Master, CurrentStatus, sequelize,numberPlate}=require('../../Models');



 const getData = async (req, res) => {
  try {
    // console.log(req.query.status)
    var replObjG = {};
    if (req.query.city) replObjG['City'] = req.query.city.split(',');
    if (req.query.location) replObjG['Location'] = req.query.location.split(',');
    if (req.query.uid) replObjG['UID'] = req.query.uid.split(',');
    if (req.query.status) replObjG['machine_status'] = req.query.status.split(',');
    if (req.query.status) replObjG['inverter_status'] = req.query.inverter_status.split(',');
  
    const replacements = {};

if (req.query.city) {
  replacements.city = req.query.city.split(',');
}

if (req.query.location) {
  replacements.location = req.query.location.split(',');
}

if (req.query.uid) {
  replacements.uid = req.query.uid.split(',');
}

if (req.query.status) {
  replacements.machine_status = req.query.status.split(',');
}

if (req.query.inverter_status) {
  replacements.inverter_status = req.query.inverter_status.split(',');
}

const [objAll, _metadata] = await sequelize.query(`
  SELECT a.*, b.* 
  FROM TrafficLightColors a
  LEFT JOIN TrafficLight_summary b ON a.Junction = b.Junction
  WHERE 1=1
  ${req.query.city ? ` AND b.City IN (:city)` : ''}
  ${req.query.location ? ` AND b.zone IN (:location)` : ''}
  ${req.query.uid ? ` AND b.ward IN (:uid)` : ''}
`, { replacements });

const [obj, metadata] = await sequelize.query(`
  SELECT a.*, b.*, c.* 
  FROM TrafficLightColors a
  LEFT JOIN TrafficLight_summary b ON a.Junction = b.Junction
  LEFT JOIN InverterStaus c ON a.Junction = c.Junction
  WHERE 1=1
  ${replObjG.City ? ` AND b.City IN (:city)` : ''}
  ${replObjG.Location ? ` AND b.zone IN (:location)` : ''}
  ${replObjG.UID ? ` AND b.ward IN (:uid)` : ''}
  ${replObjG.machine_status ? ` AND b.light_status IN (:machine_status)` : ''}
  ${replObjG.inverter_status ? ` AND b.inverter_status IN (:inverter_status)` : ''}
`, { replacements });
    // console.log(obj,objAll)
    return successResponse(req, res, { data: obj || [], dataAll: objAll || [] });
  } catch (error) {
    console.log(error)
    return errorResponse(req, res, error.message);
  }
};



 const getCities = async (req, res) => {
    try {
      const [obj, metadata] = await sequelize.query(`
        select distinct City from TrafficLightDevices order by City;
      `
      );
      var respObj = obj.map(q => q.City);
    //   if (!req.user.isAdmin && req.user.City)
    //     respObj = respObj.filter(q => req.user.City.split(',').indexOf(q) >= 0)
      return successResponse(req, res, respObj);
    } catch (error) {
      // console.log(error)
      return errorResponse(req, res, error.message);
    }
  };
   const getLocations = async (req, res) => {
    try {

      const [obj, metadata] = await sequelize.query(`
        select distinct zone from TrafficLightDevices where City in (:city) order by zone;
      `, {
        replacements: {
          city: req.query.city.split(','),
       
        },
      });
      var respObj = obj.map(q => q.zone);
    //   if (!req.user.isAdmin && req.user.ward)
    //     respObj = respObj.filter(q => req.user.ward.split(',').indexOf(q) >= 0)
      return successResponse(req, res, respObj);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  };

   const getUid = async (req, res) => {
    try {
      // console.log(req.query.city)
      // console.log(req.query.location);
      const [obj, metadata] = await sequelize.query(`
        select distinct ward from TrafficLightDevices where City in (:city) and zone in (:location) order by ward;
      `, {
        replacements: {
          city: req.query.city.split(','),
          location:req.query.location.split(',')
        
        },
      });

      return successResponse(req, res, obj.map(q => q.ward));
    } catch (error) {
      // console.log(error)
      return errorResponse(req, res, error.message);
    }
  };

  const getBeats = async (req, res) => {
    try {
      // console.log(req.query.city)
      // console.log(req.query.location);
      const [obj, metadata] = await sequelize.query(`
        select distinct beat from TrafficLightDevices where City in (:city) and zone in (:location) and ward in (:uid) order by beat;
      `, {
        replacements: {
          city: req.query.city.split(','),
          location:req.query.location.split(','),
          uid:req.query.uid.split(',')
        
        },
      });

      return successResponse(req, res, obj.map(q => q.beat));
    } catch (error) {
      // console.log(error)
      return errorResponse(req, res, error.message);
    }
  };
  
  module.exports={getData,getCities,getLocations,getUid,getBeats}