module.exports = function(sequelize, DataTypes) {
    var UsersLikePosts = sequelize.define('UsersLikePosts', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'USERS_LIKE_POSTS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {}
    });
    return UsersLikePosts;
};
