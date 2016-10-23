module.exports = function(sequelize, DataTypes) {
    var Posts = sequelize.define('Posts', {
        post_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        board_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        board_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        post_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        post_content_html: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        posted_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'POSTS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {}
    });
    return Posts;
};
