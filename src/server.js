require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
require('express-group-routes');
const app = express();
const { swaggerUi, specs } = require('../config/swagger');
const { sequelize } = require('../src/databases/models');
// routes
const platformRoutes = require('../src/routes/platform.route');
const walletRoutes = require('../src/routes/wallet.route');
const { swaggerAuth } = require('./middlewares/app.middleware');
const { generateToken, generateSignatureKey } = require('../src/utils/helper');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.options('*', cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.group('/api/v1/', (appRouter) => {
  appRouter.use('/platform', platformRoutes);
  appRouter.use('/wallet', walletRoutes);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Service Running!' });
});

app.get('/check-health', async (req, res) => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
    return res.status(200).json({
      message: 'Check Health successfully!',
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return res.status(500).json({
      message: 'Check Health Failed!',
    });
  }
});

app.post('/generateSignatureKey', async (req, res) => {
  try {
    const { uuid, accessKey, reqBody } = req.body;
    const token = generateToken(uuid, accessKey);
    const body = reqBody;
    const signatureKey = generateSignatureKey(body, token);
    return res.status(200).json({
      signature: signatureKey,
    });
  } catch (error) {
    console.error('Unable to generate signature key:', error);
    return res.status(500).json({
      message: 'Generate Signature Key Failed!',
    });
  }
});

// Menyajikan aset statis Swagger UI tanpa otentikasi
app.use('/api-docs', swaggerUi.serve);
// Menerapkan otentikasi hanya pada halaman utama Swagger UI
app.get('/api-docs', swaggerAuth, swaggerUi.setup(specs));

module.exports = app;
