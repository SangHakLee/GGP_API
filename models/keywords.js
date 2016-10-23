module.exports = function(sequelize, DataTypes) {
  var Keywords = sequelize.define('Keywords', {
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
	  unique: true
    }
  }, {
    tableName: 'KEYWORDS',
    freezeTableName: true,
    underscored: true,
    classMethods: {},
    hooks: {}
  });
  return Keywords;
};
