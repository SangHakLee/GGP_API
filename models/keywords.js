module.exports = function(sequelize, DataTypes) {
    var Keywords = sequelize.define('Keywords', {
        keyword: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        tableName: 'KEYWORDS',
        freezeTableName: true,
        underscored: true,
        classMethods: {},
        hooks: {},
        defaultScope: {
            order: 'count DESC'

        }
    });
    return Keywords;
};
