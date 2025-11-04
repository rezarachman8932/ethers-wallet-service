const PlatformService = require('../services/platform.service');
const { responseWrapper } = require('../utils/helper');
const { StatusCodes } = require('http-status-codes');

const getPlatform = async (req, res) => {
    const data = await PlatformService.getAll();
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