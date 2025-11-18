const express = require('express');
const WalletRouter = new express.Router();
const WalletController = require('../controllers/wallet.controller');
const { authMiddleware } = require('../middlewares/app.middleware');

WalletRouter.post("/", authMiddleware, WalletController.createWallet);
WalletRouter.post('/private', authMiddleware, WalletController.getWalletByPrivateKey);
WalletRouter.post('/mnemonic', authMiddleware, WalletController.getWalletByMnemonic);
WalletRouter.post('/balance', authMiddleware, WalletController.getWalletBalance);
WalletRouter.post('/transaction/history', authMiddleware, WalletController.getTransactionHistory);
WalletRouter.post('/transaction/detail', authMiddleware, WalletController.getTransactionDetail);

module.exports = WalletRouter;