const { ethers } = require("ethers");
const response = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const AUDIT_ACTION = require('../constants/auditAction.constant');
const AuditrailService = require('../services/auditrail.service');

const createWallet = async (req, res) => {
    try {
        const wallet = ethers.Wallet.createRandom();

        await AuditrailService.create({
            action: AUDIT_ACTION.CREATE_WALLET, 
            header: req.headers, 
            body: req.body, 
            ipAddress: req.ip
        });

        const walletData = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase
        };

        return response.response.success(res, 'New wallet created successfully!', walletData, StatusCodes.CREATED);
    } catch (error) {
        return response.response.error(res, "Failed to create wallet", error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  const getWalletByPrivateKey = async (req, res) => {
    try {
        const { privateKey } = req.body;
        if (!privateKey) {
            return response.response.error(res, "Missing private key in the request body!", error.message, StatusCodes.BAD_REQUEST);
        }

        const wallet = new ethers.Wallet(privateKey);
        const walletData = {
            address: wallet.address,
            privateKey: wallet.privateKey
        };

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
            return response.response.error(res, "Missing mnemonic in the request body!", error.message, StatusCodes.BAD_REQUEST);
        }

        const wallet = ethers.Wallet.fromPhrase(mnemonic);
        const walletData = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase
        };

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

module.exports = { createWallet, getWalletByPrivateKey, getWalletByMnemonic }