require("dotenv").config();
const { StatusCodes } = require('http-status-codes');
const { responseWrapper } = require("../utils/helper");
const sampleApplicationAccess = async (req, res, next) => {
    const {accesscode} = req.headers;
    if (!accesscode) return responseWrapper(res, false, StatusCodes.BAD_REQUEST, 'accesscode is required!', null);
    if (accesscode !== process.env.ACCESS_CODE) return responseWrapper(res, false, StatusCodes.UNAUTHORIZED, 'invalid access code!', null);
    next();
}
module.exports = { sampleApplicationAccess };