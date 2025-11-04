'use strict'
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Auditrail extends Model {
    static associate(models) {
      
    }
  }
  Auditrail.init(
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
      action: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      header: {
        type: DataTypes.JSON,
      },
      body: {
        type: DataTypes.JSON,
      },
      ipAddress: {
        type: DataTypes.STRING(100),
      },
    },
    {
        sequelize,
        modelName: 'Auditrail',
        underscored: false,
        tableName: 'auditrails',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
  );
  Auditrail.beforeCreate((data) => data.uuid = uuidv4());
  return Auditrail;
}
