'use strict';

module.exports = (sequelizeDatabase, DataTypes) => sequelizeDatabase.define('food', {
    name: {
        type: DataTypes.STRING,
        allowNULL: true,
    },
    group: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});