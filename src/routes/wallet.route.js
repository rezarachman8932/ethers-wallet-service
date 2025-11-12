const express = require('express');
const WalletRouter = new express.Router();
const WalletController = require('../controllers/wallet.controller');
const { authMiddleware } = require('../middlewares/app.middleware');

WalletRouter.post("/", authMiddleware, WalletController.createWallet);

module.exports = WalletRouter;