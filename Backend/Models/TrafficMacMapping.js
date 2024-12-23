'use strict';



module.exports = (sequelize, DataTypes) => {
    const TrafficMacMapping = sequelize.define(
      'TrafficMacMapping',
      {
        UID: {
            type: DataTypes.STRING,
      
          },
        MacID: {
            type: DataTypes.STRING,
      
          },
          Location: {
            type: DataTypes.STRING,
      
          },

          City: {
            type: DataTypes.STRING,
      
          },
        SocketNumber: {
          type: DataTypes.STRING,
    
        },
        V1: {
            type: DataTypes.STRING,
          },
          V2: {
            type: DataTypes.STRING,
          },
          V3: {
            type: DataTypes.STRING,
          },
          V4: {
            type: DataTypes.STRING,
          },
          V5: {
            type: DataTypes.STRING,
          },
          V6: {
            type: DataTypes.STRING,
          },
          V7: {
            type: DataTypes.STRING,
          },
        
          lastHeartBeatTime:{
            type:DataTypes.DATE,
            allowNull:false
          },
        
          FotaMessage:{
            type:DataTypes.STRING,
           
          },
          RstMessage:{
            type:DataTypes.STRING,
            
          },
         
          FWoutput:{
            type:DataTypes.STRING,
            
          },
        
          FotaURLoutput:{
            type:DataTypes.STRING,
          
          },
          URLoutput:{
            type:DataTypes.STRING,
            
          },
         
          HBToutput:{
            type:DataTypes.STRING,
            
          },
          SIPoutput:{
            type:DataTypes.STRING,
            
          },
          SSIDoutput:{
            type:DataTypes.STRING,
            
          },
          SSIDmessage:{
            type:DataTypes.STRING,
            
          },
          PWDoutput:{
            type:DataTypes.STRING,
            
          },
          SSID1output:{
            type:DataTypes.STRING,
            
          },
          PWD1output:{
            type:DataTypes.STRING,
            
          },
         
          SNoutput:{
            type:DataTypes.STRING,
            
          },
          SNmessage:{
            type:DataTypes.STRING,
            
          },
          ERASEoutput:{
            type:DataTypes.STRING,
            
          },
         
          ERASEmessage:{
            type:DataTypes.STRING,
            
          },
         
          SIPmessage:{
            type:DataTypes.STRING,
            
          },
          H1message:{
            type:DataTypes.STRING,
            
          },
          H2message:{
            type:DataTypes.STRING,
            
          },
          H3message:{
            type:DataTypes.STRING,
            
          },
          H4message:{
            type:DataTypes.STRING,
            
          },
          FLASHmessage:{
            type:DataTypes.STRING,
            
          },
          OFFmessage:{
            type:DataTypes.STRING,
            
          },
          NEXTmessage:{
            type:DataTypes.STRING,
            
          },
          AUTOmessage:{
            type:DataTypes.STRING,
            
          },
          Qmessage:{
            type:DataTypes.STRING,
            
          },
          C1message:{
            type:DataTypes.STRING,
            
          },
          C2message:{
            type:DataTypes.STRING,
            
          },
          C3message:{
            type:DataTypes.STRING,
            
          },
          C4message:{
            type:DataTypes.STRING,
            
          },
          C5message:{
            type:DataTypes.STRING,
            
          },
          C6message:{
            type:DataTypes.STRING,
            
          },
          C7message:{
            type:DataTypes.STRING,
            
          },
         
         
         
         
         
         
         
         
         
         
          
         
         
         
         
      },
      {
        tableName: 'TrafficMacMapping'
      }
    
    );
    TrafficMacMapping.associate = function (models) {
      // associations can be defined here
    };
    return TrafficMacMapping;
  };