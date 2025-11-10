require("dotenv").config();

const models = require('../databases/models/index');
const Platform = models.Platform;

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
        const authToken = req.headers['authorization'] || req.get('authorization');
        const accessKey = req.headers['x-wallet-access-key'] || req.get('x-wallet-access-key');

        // Check presence
        if (!accessKey || !authToken) {
            return responseWrapper(
                res,
                false,
                StatusCodes.UNAUTHORIZED,
                'Missing access key or auth token!'
            );
        }

        // Extract token from "Bearer <token>" format
        const [scheme, token] = authToken.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return responseWrapper(
                res,
                false,
                StatusCodes.UNAUTHORIZED,
                'Invalid authorization header format!'
            );
        }

        // Find platform by access key and token
        const keyRecord = await Platform.findOne({ where: { accessKey, token } });
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