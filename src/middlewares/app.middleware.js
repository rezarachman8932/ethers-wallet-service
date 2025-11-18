require("dotenv").config();

const models = require('../databases/models/index');
const Platform = models.Platform;
const { StatusCodes } = require('http-status-codes');
const response = require('../utils/response');

const authMiddleware = async (req, res, next) => {
    try {
        const authToken = req.headers['authorization'] || req.get('authorization');
        const accessKey = req.headers['x-wallet-access-key'] || req.get('x-wallet-access-key');

        // Check presence
        if (!accessKey || !authToken) {
            return response.response.error(
                res,
                'Missing access key or auth token!',
                null,
                StatusCodes.UNAUTHORIZED
            );
        }

        // Extract token from "Bearer <token>" format
        const [scheme, token] = authToken.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return response.response.error(
                res,
                'Invalid authorization header format!',
                null,
                StatusCodes.UNAUTHORIZED
            );
        }

        // Find platform by access key and token
        const keyRecord = await Platform.findOne({ where: { accessKey, token } });
        if (!keyRecord) {
            return response.response.error(
                res,
                'Invalid access key or auth token!',
                null,
                StatusCodes.FORBIDDEN
            );
        }

        next();
    } catch (err) {
        console.error('Error in authMiddleware:', err);
        return response.response.error(
            res,
            'Unauthorized access! Please provide valid credentials.',
            null,
            StatusCodes.UNAUTHORIZED
        );
    }
}

module.exports = { authMiddleware };