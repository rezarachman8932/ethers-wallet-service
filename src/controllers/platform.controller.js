const PlatformService = require('../services/platform.service');
const AuditrailService = require('../services/auditrail.service');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const response = require('../utils/response');
const { StatusCodes } = require('http-status-codes');

/**
 * getPlatform
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
const getPlatform = async (req, res) => {
  const data = await PlatformService.getAll();

  await AuditrailService.create({
    action: AUDIT_ACTION.GET_PLATFORM,
    header: req.headers,
    body: req.body,
    ipAddress: req.ip,
  });

  return response.response.success(res, 'Get platform successfully!', data);
};

/**
 * createPlatform
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
const createPlatform = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return response.response.error(
        res,
        'Platform name is required!',
        null,
        StatusCodes.BAD_REQUEST
      );

    const newPlatform = await PlatformService.create({ name, description });

    await AuditrailService.create({
      action: AUDIT_ACTION.CREATE_PLATFORM,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'Platform created successfully!',
      newPlatform,
      StatusCodes.CREATED
    );
  } catch (err) {
    return response.response.error(res, err.message, null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getPlatform,
  createPlatform,
};
