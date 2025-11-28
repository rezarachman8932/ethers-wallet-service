const express = require('express');
const PlatformRouter = new express.Router();
const PlatformController = require('../controllers/platform.controller');
const { authVerifyMiddleware } = require('../middlewares/app.middleware');

PlatformRouter.post('/', PlatformController.createPlatform);
PlatformRouter.get('/', authVerifyMiddleware, PlatformController.getPlatform);

module.exports = PlatformRouter;
