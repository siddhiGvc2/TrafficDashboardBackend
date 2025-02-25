module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
      queryInterface.addColumn('TrafficLightColors', 'Mode', {
        type: Sequelize.STRING,
        defaultValue: null,
      }),
    

    ]),
  
    down: (queryInterface, Sequelize) => Promise.all([
      queryInterface.removeColumn('TrafficLightColors', 'Mode'),
     
    
    ]),
  };