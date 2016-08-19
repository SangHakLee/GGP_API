module.exports = function(sequelize, DataTypes){
    var Users = sequelize.define('Users', {
      name : {
        type : DataTypes.STRING(10)
      }
    });
    return Users;
};
