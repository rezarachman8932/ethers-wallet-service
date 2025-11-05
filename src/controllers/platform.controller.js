const PlatformService = require('../services/platform.service');
const AuditrailService = require('../services/auditrail.service');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const { responseWrapper } = require('../utils/helper');
const { StatusCodes } = require('http-status-codes');

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

module.exports = {
    getPlatform
}