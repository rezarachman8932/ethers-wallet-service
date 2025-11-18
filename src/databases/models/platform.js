'use strict'
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      
    }
  }
  Platform.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING(65),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      token: {
        type: DataTypes.TEXT,
      },
      accessKey: {
        type: DataTypes.TEXT,
      },
    },
    {
        sequelize,
        modelName: 'Platform',
        underscored: false,
        tableName: 'platforms',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
  );
  Platform.beforeCreate((data) => data.uuid = uuidv4());
  return Platform;
}