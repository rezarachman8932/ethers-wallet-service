require("dotenv").config();

const { Platform } = require("../databases/models/plaform");
const { StatusCodes } = require('http-status-codes');
const { responseWrapper } = require("../utils/helper");

const sampleApplicationAccess = async (req, res, next) => {
    const {accesscode} = req.headers;
    if (!accesscode) return responseWrapper(res, false, StatusCodes.BAD_REQUEST, 'accesscode is required!', null);
    if (accesscode !== process.env.ACCESS_CODE) return responseWrapper(res, false, StatusCodes.UNAUTHORIZED, 'invalid access code!', null);
    next();
}

const authMiddleware = async (req, res, next) => {
    try {
        const authToken = req.headers['Authorization'];
        const accessKey = req.headers['x-wallet-access-key'];

        // Check presence
        if (!accessKey || !authToken) {
            return responseWrapper(
                res,
                false,
                StatusCodes.UNAUTHORIZED,
                'Missing access key or auth token!'
            );
        }

        // Extract and verify bearer token
        const token = authToken.split(' ')[1];
        if (!token) {
            return responseWrapper(
                res,
                false,
                StatusCodes.UNAUTHORIZED,
                'Invalid authorization header format!'
            );
        }

        // Validate access key and auth token
        const keyRecord = await Platform.findOne({ where: { accessKey: accessKey, token: token } });
        if (!keyRecord) {
            return responseWrapper(
                res,
                false,
                StatusCodes.FORBIDDEN,
                'Invalid access key or auth token!'
            );
        }

        next();
    } catch (err) {
        return responseWrapper(
            res,
            false,
            StatusCodes.UNAUTHORIZED,
            'Unauthorized access! Please provide valid credentials.'
        );
    }
}

module.exports = { sampleApplicationAccess, authMiddleware };