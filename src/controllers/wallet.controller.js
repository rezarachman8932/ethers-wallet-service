const response = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const AuditrailService = require('../services/auditrail.service');
const EthersService = require('../services/ethers.service');
const HistoryService = require('../services/history.service');

const ethersService = require('../services/ethers.service');

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
        'Missing address or network in the request body!',
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

    return response.response.success(res, 'Balance fetched successfully!', balanceData);
  } catch (error) {
    return response.response.error(
      res,
      'Unable to fetch wallet balance!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { address, network } = req.body;
    if (!address || !network) {
      return response.response.error(
        res,
        'Missing address or network in the request body!',
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

    return response.response.success(res, 'Transaction history fetched successfully!', data);
  } catch (error) {
    return response.response.error(
      res,
      'Failed to fetch transaction history!',
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
        'Missing txHash or network in the request body!',
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

    return response.response.success(res, 'Transaction detail fetched successfully!', data);
  } catch (error) {
    return response.response.error(
      res,
      'Failed to fetch transaction detail!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getGasEstimation = async (req, res) => {
  try {
    const { privateKey, network, contractAddress, abi, method, params } = req.body;

    if (!network || !contractAddress || !abi || !method || !privateKey) {
      return response.response.error(
        res,
        'Missing required fields (network, contractAddress, abi, method, from)!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const gas = await EthersService.estimateGasForContractMethod({
      privateKey,
      network,
      contractAddress,
      abi,
      method,
      params,
    });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_ESTIMATION_COST,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Estimation cost  fetched successfully!', gas);
  } catch (error) {
    return response.response.error(
      res,
      'Failed to get the estimation cost!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getGasPrice = async (req, res) => {
  try {
    const { network } = req.query;
    if (!network) {
      return response.response.error(
        res,
        'Query param network is required!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await EthersService.getGasPrice(network);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_GAS_PRICE,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Gas price fetched successfully!', result);
  } catch (error) {
    return response.response.error(
      res,
      'Failed to get gas price!',
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
        'Missing required fields!',
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

    return response.response.success(res, 'Balance transferred successfully!', result);
  } catch (error) {
    return response.response.error(
      res,
      'Transfer balance failed',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getLatestBlock = async (req, res) => {
  try {
    const { network } = req.query;
    if (!network) {
      return response.response.error(
        res,
        "Query parameter of 'network' is required!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await ethersService.getLatestBlock(network);

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_LATEST_BLOCK,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Latest block fetched successfully!', result);
  } catch (error) {
    return response.response.error(
      res,
      'Latest block failed to get!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getBlockByHash = async (req, res) => {
  try {
    const { network, hash } = req.query;
    if (!network || !hash) {
      return response.response.error(
        res,
        "Query parameters of 'network' and 'hash' are required!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await ethersService.getBlockByHash({ network, hash });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_BLOCK_BY_HASH,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Block fetched by hash successfully!', result);
  } catch (error) {
    return response.response.error(
      res,
      'Block fetched by hash failed to get!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getBlockByNumber = async (req, res) => {
  try {
    const { network, blockNumber } = req.query;
    if (!network || !blockNumber) {
      return response.response.error(
        res,
        "Query parameters of 'network' and 'blockNumber' are required!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await ethersService.getBlockByNumber({ network, blockNumber });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_BLOCK_BY_NUMBER,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(res, 'Block fetched by number successfully!', result);
  } catch (error) {
    return response.response.error(
      res,
      'Block fetched by number failed to get!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const estimateCostForTransferBalance = async (req, res) => {
  try {
    const { network, to, amount, privateKey } = req.body;

    if (!network || !to || !amount || !privateKey) {
      return response.response.error(
        res,
        'Missing required fields!',
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await EthersService.estimateGasForTransfer({
      network,
      to,
      amount,
      privateKey,
    });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_ESTIMATION_COST_TRANSFER_BALANCE,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'Estimation cost for transfer balance fetched successfully!',
      result
    );
  } catch (error) {
    return response.response.error(
      res,
      'Estimation cost for transfer balance failed to get!',
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

const getBlockWithTransactions = async (req, res) => {
  try {
    const { network, hash } = req.query;

    if (!network || !hash) {
      return response.response.error(
        res,
        "Query parameters of 'network' and 'hash' are required!",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await ethersService.getBlockWithTransactions({
      network,
      hash,
    });

    await AuditrailService.create({
      action: AUDIT_ACTION.GET_BLOCK_WITH_TRANSACTIONS,
      header: req.headers,
      body: req.body,
      ipAddress: req.ip,
    });

    return response.response.success(
      res,
      'Block with full transactions fetched successfully!',
      result
    );
  } catch (error) {
    return response.response.error(
      res,
      'Failed to fetch block with transactions!',
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
  getGasPrice,
  transfer,
  getLatestBlock,
  getBlockByHash,
  getBlockByNumber,
  estimateCostForTransferBalance,
  getBlockWithTransactions,
};
