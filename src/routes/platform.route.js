const express = require('express');
const PlatformRouter = new express.Router();
const PlatformController = require('../controllers/platform.controller');
const { sampleApplicationAccess } = require('../middlewares/app.middleware');

PlatformRouter.get("/", PlatformController.getPlatform);
// TODO: enable application access control once the middleware access logic is done 
// PlatformRouter.get("/", sampleApplicationAccess, PlatformController.getPlatform);

module.exports = PlatformRouter;