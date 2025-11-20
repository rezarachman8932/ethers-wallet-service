const ConversionService = require('../services/conversion.service');
const { StatusCodes } = require('http-status-codes');
const response = require('../utils/response');
const AuditrailService = require('../services/auditrail.service');
const AUDIT_ACTION = require('../constants/auditAction.constant');

const convertFiatToCrypto = async (req, res) => {
  try {
    const { amount, fiatCurrency, cryptoSymbol } = req.body;
    if (!amount || !fiatCurrency || !cryptoSymbol) {
      return response.response.error(
        res,
        'Missing amount, fiatCurrency or cryptoSymbol!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const data = await ConversionService.convertFiatToCrypto(amount, fiatCurrency, cryptoSymbol);

    await AuditrailService.create({
      action: AUDIT_ACTION.CONVERT_FIAT,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Conversion succeed!', data);
  } catch (error) {
    return response.response.error(
      res,
      'Conversion failed!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

module.exports = { convertFiatToCrypto };
