var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
        user_id: {
            type: DataTypes.STRING(50),
            unique: true,
			set: function(val) {
	 			this.setDataValue("user_id", val);
	 			this.setDataValue("name", val);
			},
        },
		password: {
			type: DataTypes.TEXT,
			set: function(val) {
				var salt = bcrypt.genSaltSync(10);
	 			var hash = bcrypt.hashSync(val, salt);
	 			this.setDataValue("password", hash);
			},
			get : function(){
      			return "";
    		}
		},
        name: {
            type: DataTypes.STRING(20)
        },
		email: {
			type: DataTypes.STRING(50)
		},
        picture: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'USERS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {}
    });
    return Users;
};
