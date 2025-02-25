const { NOW } = require('sequelize');
const { Master, CurrentStatus, sequelize,NumberPlates,TrafficLightColors}=require('../Models')
var events = require('./events');
//a
const num = a => {
    if (['BST', 'BEN', 'BER'].indexOf(a) > -1) return a == 'BST' ? 1 : a == 'BEN' ? 0 : 2;
    if (isNaN(parseInt(a))) return null;
    else return parseInt(a);
}
//q
module.exports.parse = (payload, mqttClient,topic) => {
  let cleanedStr =payload.toString().replace(/[*#]/g, '');
  parseInternal(cleanedStr,mqttClient,topic);
    // if (!/.*?(\*[0-9A-Za-z\,]*\#)+?.*?/gm.test(payload)) return;
    // var commands = [...payload.toString().matchAll(/.*?(\*[0-9A-Za-z\,]*\#)+?.*?/gm)].map(q => q[0]);
    // commands.forEach(cmd => {
    //     try {
    //         parseInternal(cmd, mqttClient,topic);
    //     } catch (ex) {
    //         console.log('Exception in MQTT:', ex);
    //     }
    // })
}

const parseInternal = async(payload, mqttClient,topic) => {
    // 'Parsing message - ' + payload
    try {
        var cleaned = /^\**(.*?)\#*$/.exec(payload)[1];
        var parts = cleaned.split(',');
        console.log("Parts:",parts);
        // 211023 - ignore test with numeric number, allow commands in parts[0] 
        //if (!/^\d+$/.test(parts[0])) return;
        if(parts[1]=="BAT")
        {
            batteryTransactions.create({
                DeviceId:parts[0],
                Voltage:parts[2],
                Current : parts[3],
                Temperature:parts[4]
    
            })

            queryforBattery({ lastOnTime: 'NOW()', lastHeartbeatTime: 'NOW()' }, parts[0]);
        }
        if(parts[0]=="TL")
          {
            console.log("TL command received");
            // const match1 = parts[3].match(/[RAG]/);
            // const match2 = parts[4].match(/[RAG]/);
            // const match3 = parts[5].match(/[RAG]/);
            // const match4 = parts[6].match(/[RAG]/);
            const extractParts = (str) => str.match(/(\d*)([RAG]?)/) || [null, null, null];

            const match1 = extractParts(parts[3]);
            const match2 = extractParts(parts[4]);
            const match3 = extractParts(parts[5]);
            const match4 = extractParts(parts[6]);

            const obj=await TrafficLightColors.findOne({where:{Junction:parts[1]}})
            if(obj)
            {
                obj.R1= match1[2],
                obj.R2= match2[2],
                obj.R3= match3[2],
                obj.R4= match4[2],
                obj.T1= match1[1],
                obj.T2= match2[1],
                obj.T3= match3[1],
                obj.T4= match4[1],
                obj.lastHeartBeatTime=new Date().toISOString()
                await obj.save();
            }
            else{
              await TrafficLightColors.create({
                Junction:parts[1],
                R1: match1[2],
                R2: match2[2],
                R3: match3[2],
                R4: match4[2],
                T1: match1[1],
                T2: match2[1],
                T3: match3[1],
                T4: match4[1],
                lastHeartBeatTime:new Date().toISOString()
              })
            }

             
               
              reset_statusOfTrafficLights(parts,parts[2]);
              // events.pubsub.emit('searchByDeviceId','search',parts[0],parts);
          }

        // 211023 added code for detecting machine packets ie *SSN,12345# sent to GVC/VM/#
        if (parts[0] == 'SSN'){
            var from = topic.replace('GVC/VM/','');
            console.log('From -',from,'  To -',parts[1]); 
            // Transaction.create({
            //     machine: from,
            //     command: parts[0],
            //     p1: parts[1],
            // }) 
            return;
            }  
            // console.log(payload);
          
            if(parts[1]=="DOOR")
            {
              reset_statusOfDoor(parts[2],parts[0]);
            }
            if(parts[1]=="MAN")
            {
              if(parts[2]==0)
              {
                reset_statusOfAutoManual(parts[2],parts[0])
              }
              else{
                reset_statusOfRemoteLocal(parts[2],parts[0])
              }
             
            }
          
            if(parts[1]=="PL")
            {
                reset_statusOfNumberPlate(parts,parts[0])
                // events.pubsub.emit('numberPlate',parts[0]);
            }

            if (parts[1] == 'STA')
            {
                console.log(parts);
             //   events.pubsub.emit('paytm_success',parts[3],parts[2]) ;
            }   
    
        

        
            
        
    } catch (ex) {
        console.log('Failed to parse message', ex);
        // 'Failed to parse message'
    }
}


async function reset_statusOfTrafficLights(status, serial) {
   try{
     console.log("started function");
    const Device=await Master.findOne({where:{UID:serial}});
    const recordToUpdate = await CurrentStatus.findOne({ where: {UID:serial } });
    
    if (recordToUpdate) {
      // Update the properties of the record

      var Roads=Device.Roads;
      for (var i = 0; i < Roads; i++) {
        await sequelize.query(
          `UPDATE CurrentStatus
           SET  R${i + 1}PRI = :status,
           lastHeartbeatTime = NOW()
           WHERE UID = :serial`,
          {
            replacements: {
              
              status: status[i + 2],
              serial: serial,
            },
            type: sequelize.QueryTypes.UPDATE,
          }
        );
      }
   
     
    }

   }
   catch(err){
       console.log("Error updaing record :"+err)
   }
}


async function reset_statusOfNumberPlate(status, serial) {
    try{
   
       
        console.log("started function");
        const Device=await Master.findOne({where:{UID:serial}});
        const recordToUpdate = await NumberPlates.findOne({ where: {UID:serial } });
        
        if (recordToUpdate) {
          // Update the properties of the record
    
          var Roads=Device.Roads;
          for (var i = 0; i < Roads; i++) {
            await sequelize.query(
              `UPDATE NumberPlates
               SET  R${i + 1}PRI = :status,
               lastHeartbeatTime = NOW()
               WHERE UID = :serial`,
              {
                replacements: {
                  
                  status: status[i + 2],
                  serial: serial,
                },
                type: sequelize.QueryTypes.UPDATE,
              }
            );
          }
       
         
        }
    
      
     
 
    }
    catch(err){
        console.log("Error updaing record :"+err)
    }
 }

 async function reset_statusOfDoor(status,serial){
  
  const recordToUpdate = await CurrentStatus.findOne({ where: {UID:serial } });
  
  if (recordToUpdate) {
    // Update the properties of the record


   
      await sequelize.query(
        `UPDATE CurrentStatus
         SET 'Door Status' = :status
         WHERE UID = :serial`,
        {
          replacements: {
            
            status: status,
            serial: serial,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    
 
   
  }
 }

 async function reset_statusOfAutoManual(status,serial){
  
  const recordToUpdate = await CurrentStatus.findOne({ where: {UID:serial } });
  
  if (recordToUpdate) {
    // Update the properties of the record


   
      await sequelize.query(
        `UPDATE CurrentStatus
         SET 'Auto/Maunal' = :status
         WHERE UID = :serial`,
        {
          replacements: {
            
            status: status,
            serial: serial,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    
 
   
  }
 }

 async function reset_statusOfRemoteLocal(status,serial){
  
  const recordToUpdate = await CurrentStatus.findOne({ where: {UID:serial } });
  
  if (recordToUpdate) {
    // Update the properties of the record


   
      await sequelize.query(
        `UPDATE CurrentStatus
         SET 'Local/Remote' = :status
         WHERE UID = :serial`,
        {
          replacements: {
            
            status: status,
            serial: serial,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    
 
   
  }
 }


 function queryforBattery(values, serial) {
  console.log("batterySerial",serial)
  var parts = Object.keys(values).map(k => `${k} = ${values[k]}`).join(', ');
  sequelize.query(`
      update batteriesData set ${parts} where device_number = '${serial}'
             
  `).catch(function (ex) {
      console.log('Error', ex);
  });
}