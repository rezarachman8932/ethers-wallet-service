const express = require('express');
const PlatformRouter = new express.Router();
const PlatformController = require('../controllers/platform.controller');
const { authMiddleware } = require('../middlewares/app.middleware');

PlatformRouter.get("/", authMiddleware, PlatformController.getPlatform);

module.exports = PlatformRouter;