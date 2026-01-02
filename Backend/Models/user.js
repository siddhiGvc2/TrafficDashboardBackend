

module.exports = (sequelize, DataTypes) => {
  const trafficUsers = sequelize.define(
    'trafficUsers',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // City: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // zone: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // ward: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      // beat: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
  
      // clientName: {
      //   type: DataTypes.STRING,
      
      // },
      // superAdmin: {
      //   type: DataTypes.STRING,
      
      // },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    
   
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'verifyToken'] },
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ['password', 'verifyToken'] },
        },
      },
    },
  );
  trafficUsers.associate = function (models) {
    // associations can be defined here
  };
  return trafficUsers;
};
