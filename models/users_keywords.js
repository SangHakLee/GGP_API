module.exports = function(sequelize, DataTypes) {
    var UsersKeywords = sequelize.define('UsersKeywords', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'USERS_KEYWORDS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {}
    });
    return UsersKeywords;
};
