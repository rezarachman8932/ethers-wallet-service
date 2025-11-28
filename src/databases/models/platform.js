'use strict';

const { Model } = require('sequelize');
const { generatePlatformCredentials } = require('../../utils/helper');

module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {}
  }
  Platform.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
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
  Platform.beforeCreate((data) => {
    const { uuid, accessKey, token } = generatePlatformCredentials();
    data.uuid = uuid;
    data.accessKey = accessKey;
    data.token = token;
  });
  return Platform;
};
