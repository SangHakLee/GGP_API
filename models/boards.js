module.exports = function(sequelize, DataTypes) {
  var Boards = sequelize.define('Boards', {
    board_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    board_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url_root: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url_cname: {
      type: DataTypes.STRING,
      allowNull: false
    },
	cron_rule: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paging: {
      type: DataTypes.STRING,
      allowNull: true
    },
    now_board_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    now_post_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'BOARDS',
    freezeTableName: true,
    underscored: true,
    classMethods: {},
    hooks: {}
  });
  return Boards;
};
