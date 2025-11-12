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

module.exports = { createWallet }