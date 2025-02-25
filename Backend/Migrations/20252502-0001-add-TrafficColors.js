module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
      queryInterface.addColumn('TrafficLightColors', 'T1', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn('TrafficLightColors', 'T2', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn('TrafficLightColors', 'T3', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
      queryInterface.addColumn('TrafficLightColors', 'T4', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),


    ]),
  
    down: (queryInterface, Sequelize) => Promise.all([
      queryInterface.removeColumn('TrafficLightColors', 'T1'),
      queryInterface.removeColumn('TrafficLightColors', 'T2'),
      queryInterface.removeColumn('TrafficLightColors', 'T3'),
      queryInterface.removeColumn('TrafficLightColors', 'T4'),
    
    ]),
  };