const response = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const AuditrailService = require('../services/auditrail.service');
const EthersService = require('../services/ethers.service');
const HistoryService = require('../services/history.service');

const createWallet = async (req, res) => {
  try {
    const walletData = EthersService.createWallet();

    await AuditrailService.create({
      action: AUDIT_ACTION.CREATE_WALLET,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'New wallet created successfully!',
      walletData,
      StatusCodes.CREATED
    );
  } catch (error) {
    return response.response.error(
      res,
      'Failed to create wallet',
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getWalletByPrivateKey = async (req, res) => {
  try {
    const { privateKey } = req.body;
    if (!privateKey) {
      return response.response.error(
        res,
        'Missing private key in the request body!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const walletData = EthersService.getWalletByPrivateKey(privateKey);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_WALLET_BY_PRIVATE_KEY,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'Wallet retrieved successfully from private key!',
      walletData
    );
  } catch (error) {
    return response.response.error(
      res,
      'Invalid private key or unable to retrieve wallet!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getWalletByMnemonic = async (req, res) => {
  try {
    const { mnemonic } = req.body;
    if (!mnemonic) {
      return response.response.error(
        res,
        'Missing mnemonic in the request body!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const walletData = EthersService.getWalletByMnemonic(mnemonic);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_WALLET_BY_MNEMONIC,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'Wallet retrieved successfully from mnemonic!',
      walletData
    );
  } catch (error) {
    return response.response.error(
      res,
      'Invalid mnemonic or unable to retrieve wallet!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const { address, network } = req.body;
    if (!address || !network) {
      return response.response.error(
        res,
        "Missing address or network in the request body!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_ACCOUNT_BALANCE,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    const balanceData = await EthersService.getBalance(address, network);

    return response.response.success(
      res,
      "Balance fetched successfully!",
      balanceData
    );
  } catch (error) {
    return response.response.error(
      res,
      "Unable to fetch wallet balance!",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
}

const getTransactionHistory = async (req, res) => {
  try {
    const { address, network } = req.body;
    if (!address || !network) {
      return response.response.error(
        res,
        "Missing address or network in the request body!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const data = await HistoryService.getTransactionsByAddress(address, network);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_TRANSACTION_HISTORY,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      "Transaction history fetched successfully!",
      data
    );
  } catch (error) {
    return response.response.error(
      res,
      "Failed to fetch transaction history!",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    const { txHash, network } = req.body;
    if (!txHash || !network) {
      return response.response.error(
        res,
        "Missing txHash or network in the request body!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const data = await EthersService.getTransactionDetailByHash(txHash, network);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_TRANSACTION_HISTORY_DETAIL,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      "Transaction detail fetched successfully!",
      data
    );
  } catch (error) {
    return response.response.error(
      res,
      "Failed to fetch transaction detail!",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getGasEstimation = async (req, res) => {
  try {
    const { network, contractAddress, abi, method, params, from, value } = req.body;

    if (!network || !contractAddress || !abi || !method || !from) {
      return response.response.error(
        res,
        "Missing required fields (network, contractAddress, abi, method, from)!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const gas = await EthersService.estimateGasForContractMethod({
      network,
      contractAddress,
      abi,
      method,
      params,
      from,
      value
    });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_ESTIMATION_COST,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      "Estimation cost  fetched successfully!",
      gas
    );
  } catch (error) {
    return response.response.error(
      res,
      "Failed to get the estimation cost!",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const transfer = async (req, res) => {
  try {
    const { network, to, amount, privateKey } = req.body;

    if (!network || !to || !amount || !privateKey) {
      return response.response.error(
        res,
        "Missing required fields!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await EthersService.transferNativeToken({ 
      network,
      to,
      amount,
      privateKey,
    });

    await AuditrailService.create({
      action: AUDIT_ACTION.TRANSFER_BALANCE,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      "Balance transferred successfully!",
      result
    );
  } catch (error) {
    return response.response.error(
      res,
      "Transfer balance failed",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

module.exports = {
  createWallet,
  getWalletByPrivateKey,
  getWalletByMnemonic,
  getWalletBalance,
  getTransactionHistory,
  getTransactionDetail,
  getGasEstimation,
  transfer,
}