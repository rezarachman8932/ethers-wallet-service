const express = require('express');
const WalletRouter = new express.Router();
const WalletController = require('../controllers/wallet.controller');
const { authMiddleware } = require('../middlewares/app.middleware');

WalletRouter.post("/", authMiddleware, WalletController.createWallet);
WalletRouter.post('/private', authMiddleware, WalletController.getWalletByPrivateKey);
WalletRouter.post('/mnemonic', authMiddleware, WalletController.getWalletByMnemonic);

module.exports = WalletRouter;