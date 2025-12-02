const express = require('express');
const WalletRouter = new express.Router();
const WalletController = require('../controllers/wallet.controller');
const ConversionController = require('../controllers/conversion.controller');
const { authVerifyMiddleware } = require('../middlewares/app.middleware');

WalletRouter.post('/', authVerifyMiddleware, WalletController.createWallet);
WalletRouter.post('/private', authVerifyMiddleware, WalletController.getWalletByPrivateKey);
WalletRouter.post('/mnemonic', authVerifyMiddleware, WalletController.getWalletByMnemonic);
WalletRouter.post('/balance', authVerifyMiddleware, WalletController.getWalletBalance);
WalletRouter.post('/convert', authVerifyMiddleware, ConversionController.convertFiatToCrypto);
WalletRouter.post(
  '/transaction/history',
  authVerifyMiddleware,
  WalletController.getTransactionHistory
);
WalletRouter.post(
  '/transaction/detail',
  authVerifyMiddleware,
  WalletController.getTransactionDetail
);
WalletRouter.post('/estimate', authVerifyMiddleware, WalletController.getGasEstimation);
WalletRouter.get('/gas-price', authVerifyMiddleware, WalletController.getGasPrice);
WalletRouter.post('/transfer', authVerifyMiddleware, WalletController.transfer);
WalletRouter.get('/block/latest', authVerifyMiddleware, WalletController.getLatestBlock);
WalletRouter.get('/block/hash', authVerifyMiddleware, WalletController.getBlockByHash);
WalletRouter.get('/block/number', authVerifyMiddleware, WalletController.getBlockByNumber);
WalletRouter.post(
  '/estimate/gas',
  authVerifyMiddleware,
  WalletController.estimateCostForTransferBalance
);
WalletRouter.get(
  '/block/transactions',
  authVerifyMiddleware,
  WalletController.getBlockWithTransactions
);

module.exports = WalletRouter;
