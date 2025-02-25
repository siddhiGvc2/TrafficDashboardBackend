'use strict';
module.exports = (sequelize, DataTypes) => {
  const TrafficLightColors = sequelize.define('TrafficLightColors', {
    Junction:DataTypes.STRING,
    R1:DataTypes.STRING,
    R2:DataTypes.STRING,
    R3:DataTypes.STRING,
    R4:DataTypes.STRING,
    lastHeartBeatTime:DataTypes.DATE,
    T1:DataTypes.STRING,
    T2:DataTypes.STRING,
    T3:DataTypes.STRING,
    T4:DataTypes.STRING,

   
  }, {
    tableName: 'TrafficLightColors'
  });
  TrafficLightColors.associate = function(models) {
    // associations can be defined here
  };
  return TrafficLightColors;
};