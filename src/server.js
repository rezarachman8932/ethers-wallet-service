require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
require('express-group-routes');
const app = express();
const { sequelize } = require('../src/databases/models');
// routes
const platformRoutes = require('../src/routes/platform.route');
const walletRoutes = require('../src/routes/wallet.route');

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
  res.status(200).json({ message: 'Hello World!' });
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

module.exports = app;
