require('dotenv').config();

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
    if (scheme.toLowerCase() !== 'bearer' || !token) {
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
};

const authVerifyMiddleware = async (req, res, next) => {
  const { generateToken, verifySignature } = require('../utils/helper');
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
    const [scheme, signature] = authToken.split(' ');
    if (scheme.toLowerCase() !== 'bearer' || !signature) {
      return response.response.error(
        res,
        'Invalid authorization header format!',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }
    // Check signature
    if (!signature) {
      return response.response.error(
        res,
        'Missing access key or signature!',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    // Find platform by access key
    const keyRecord = await Platform.findOne({ where: { accessKey } });
    if (!keyRecord) {
      return response.response.error(res, 'Invalid access key!', null, StatusCodes.FORBIDDEN);
    }
    const token = generateToken(keyRecord.uuid, accessKey);
    const isValidSignature = verifySignature(req.body, token, signature);
    if (!isValidSignature) {
      return response.response.error(res, 'Invalid signature!', null, StatusCodes.FORBIDDEN);
    }

    next();
  } catch (err) {
    console.error('Error in authVerifyMiddleware:', err);
    return response.response.error(
      res,
      'Unauthorized access! Please provide valid credentials.',
      null,
      StatusCodes.UNAUTHORIZED
    );
  }
};

module.exports = { authMiddleware, authVerifyMiddleware };
