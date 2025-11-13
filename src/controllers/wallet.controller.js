const EthersService = require('../services/ethers.service');
const response = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const AuditrailService = require('../services/auditrail.service');

const createWallet = async (req, res) => {
    try {
        const walletData = EthersService.createWallet();

        await AuditrailService.create({
            action: AUDIT_ACTION.CREATE_WALLET, 
            header: req.headers, 
            body: req.body, 
            ipAddress: req.ip
        });

        return response.response.success(res, 'New wallet created successfully!', walletData, StatusCodes.CREATED);
    } catch (error) {
        return response.response.error(res, "Failed to create wallet", error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  const getWalletByPrivateKey = async (req, res) => {
    try {
        const { privateKey } = req.body;
        if (!privateKey) {
            return response.response.error(res, "Missing private key in the request body!", null, StatusCodes.BAD_REQUEST);
        }

        const walletData = EthersService.getWalletByPrivateKey(privateKey);

        await AuditrailService.create({
            action: AUDIT_ACTION.GET_WALLET_BY_PRIVATE_KEY, 
            header: req.headers, 
            body: req.body, 
            ipAddress: req.ip
        });

        return response.response.success(res, "Wallet retrieved successfully from private key!", walletData);
    } catch (error) {
        return response.response.error(res, "Invalid private key or unable to retrieve wallet!", error.message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
  }

  const getWalletByMnemonic = async (req, res) => {
    try {
        const { mnemonic } = req.body;
        if (!mnemonic) {
            return response.response.error(res, "Missing mnemonic in the request body!", null, StatusCodes.BAD_REQUEST);
        }

        const walletData = EthersService.getWalletByMnemonic(mnemonic);

        await AuditrailService.create({
            action: AUDIT_ACTION.GET_WALLET_BY_MNEMONIC, 
            header: req.headers, 
            body: req.body, 
            ipAddress: req.ip
        });

        return response.response.success(res, "Wallet retrieved successfully from mnemonic!", walletData);
    } catch (error) {
        return response.response.error(res, "Invalid mnemonic or unable to retrieve wallet!", error.message, StatusCodes.UNPROCESSABLE_ENTITY);
    }
  }

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

    // Choose RPC endpoint (you can later move these to env variables)
    // let rpcUrl;
    // if (network === 'ethereum') {
    //   rpcUrl = 'https://eth.llamarpc.com'; // free public RPC
    // } else if (network === 'polygon') {
    //   rpcUrl = 'https://polygon.llamarpc.com'; // free public RPC
    // } else {
    //   return response.response.error(
    //     res,
    //     "Unsupported network. Please use 'ethereum' or 'polygon'.",
    //     null,
    //     StatusCodes.BAD_REQUEST
    //   );
    // }

    // const provider = new ethers.JsonRpcProvider(rpcUrl);
    // const balanceWei = await provider.getBalance(address);
    // const balance = ethers.formatEther(balanceWei);

    await AuditrailService.create({
        action: AUDIT_ACTION.GET_ACCOUNT_BALANCE,
        header: req.headers,
        body: req.body,
        ipAddress: req.ip,
    });

    return response.response.success(
      res,
      "Balance fetched successfully!",
      {
        network,
        address,
        balance
      }
    );
  } catch (error) {
    return response.response.error(
      res,
      "Unable to fetch wallet balance!",
      error.message,
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

module.exports = { createWallet, getWalletByPrivateKey, getWalletByMnemonic, getWalletBalance }