module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
        user_id: {
            type: DataTypes.STRING(50),
            unique: true
        },
        name: {
            type: DataTypes.STRING(20)
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
