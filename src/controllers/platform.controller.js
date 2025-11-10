const PlatformService = require('../services/platform.service');
const AuditrailService = require('../services/auditrail.service');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const { responseWrapper } = require('../utils/helper');
const { StatusCodes } = require('http-status-codes');
const { generatePlatformCredentials } = require('../utils/helper');
const { Platform } = require('../databases/models');

const getPlatform = async (req, res) => {
    const data = await PlatformService.getAll();

    await AuditrailService.create({
        action: AUDIT_ACTION.GET_PLATFORM,
        header: req.headers,
        body: req.body,
        ipAddress: req.ip
    });

    return responseWrapper(
        res,
        true,
        StatusCodes.OK,
        'get platform successfully!',
        data
    )
}

const createPlatform = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return responseWrapper(res, false, 400, 'Platform name is required!');

    const { uuid, accessKey, token } = generatePlatformCredentials();

    const newPlatform = await Platform.create({
      uuid,
      name,
      description,
      accessKey,
      token
    });

    return responseWrapper(res, true, 201, 'Platform created successfully!', newPlatform);
  } catch (err) {
    return responseWrapper(res, false, 500, err.message);
  }
};

module.exports = {
    getPlatform,
    createPlatform
}