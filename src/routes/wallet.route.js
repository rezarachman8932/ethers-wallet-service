const express = require('express');
const WalletRouter = new express.Router();
const WalletController = require('../controllers/wallet.controller');
const ConversionController = require('../controllers/conversion.controller');
const { authMiddleware } = require('../middlewares/app.middleware');

WalletRouter.post('/', authMiddleware, WalletController.createWallet);
WalletRouter.post('/private', authMiddleware, WalletController.getWalletByPrivateKey);
WalletRouter.post('/mnemonic', authMiddleware, WalletController.getWalletByMnemonic);
WalletRouter.post('/balance', authMiddleware, WalletController.getWalletBalance);
WalletRouter.post('/convert', authMiddleware, ConversionController.convertFiatToCrypto);
WalletRouter.post('/transaction/history', authMiddleware, WalletController.getTransactionHistory);
WalletRouter.post('/transaction/detail', authMiddleware, WalletController.getTransactionDetail);
WalletRouter.post("/estimate", authMiddleware, WalletController.getGasEstimation);
WalletRouter.post("/transfer", authMiddleware, WalletController.transfer);

module.exports = WalletRouter;