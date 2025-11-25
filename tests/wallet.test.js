const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { sequelize } = require('../src/databases/models');
const { generatePlatformCredentials } = require('../src/utils/helper');
const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;

describe('POST /api/v1/wallet', () => {
  let validAccessKey, validToken;

  before(async function () {
    this.timeout(5000);

    const { uuid, accessKey, token } = generatePlatformCredentials();
    const platform = await Platform.create({
      uuid,
      name: 'Wallet Test New Reza',
      token,
      accessKey,
    });

    validAccessKey = platform.accessKey;
    validToken = platform.token;
  });

  after(async () => {
    await sequelize.close();
  });

  const abi = [
    {
      "inputs": [],
      "name": "increment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalReceived",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  it('should create a new wallet successfully', async () => {
    const res = await request(app)
      .post('/api/v1/wallet')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'New wallet created successfully!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.ok(typeof res.body.data.mnemonic === 'string');

    const count = await Auditrail.count();
    const secondRecord = await Auditrail.findOne({
      offset: 1,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 2);
    assert.equal(secondRecord.action, 'CREATE_WALLET');
  });

  it('should return wallet data from private key successfully', async () => {
    const privateKey = '0x4c0883a6910395b8b6a1237e9c31c7b03cbe0b5c7f8d9a8c2a66c475f8c6f0a9';

    const res = await request(app)
      .post('/api/v1/wallet/private')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ privateKey });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Wallet retrieved successfully from private key!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.equal(res.body.data.privateKey, privateKey);

    const count = await Auditrail.count();
    const thirdRecord = await Auditrail.findOne({
      offset: 2,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 3);
    assert.equal(thirdRecord.action, 'GET_WALLET_BY_PRIVATE_KEY');
  });

  it('should return 400 if private key missing', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/private')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({});

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing private key in the request body!'));
  });

  it('should return wallet data from mnemonic successfully', async () => {
    const mnemonic = 'test test test test test test test test test test test junk';

    const res = await request(app)
      .post('/api/v1/wallet/mnemonic')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ mnemonic });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Wallet retrieved successfully from mnemonic!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.equal(res.body.data.mnemonic, mnemonic);

    const count = await Auditrail.count();
    const fourthRecord = await Auditrail.findOne({
      offset: 3,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 4);
    assert.equal(fourthRecord.action, 'GET_WALLET_BY_MNEMONIC');
  });

  it('should return 400 if mnemonic missing', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/mnemonic')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({});

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing mnemonic in the request body!'));
  });

  it('should fetch balance successfully for a valid address and network', async () => {
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const network = 'ethereum';

    const res = await request(app)
      .post('/api/v1/wallet/balance')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ address, network });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Balance fetched successfully!');
  });

  it('should fail when address or network is missing', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/balance')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ address: '' });

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing address or network in the request body!'));
  });

  it('should fetch transaction detail successfully for a valid txHash and network', async function () {
    this.timeout(5000);

    const txHash = '0x3384291afad5486985d0d79be408b0dc1bfa6b703ae728135ff57038c524dd1d';
    const network = 'polygon';

    const res = await request(app)
      .post('/api/v1/wallet/transaction/detail')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('Authorization', 'Bearer ' + validToken)
      .send({ txHash, network });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Transaction detail fetched successfully!');

    assert.ok(typeof res.body.data === 'object');
    assert.equal(res.body.data.hash?.toLowerCase(), txHash.toLowerCase());

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']]
    });

    assert.equal(lastRecord.action, 'GET_TRANSACTION_HISTORY_DETAIL');
  });

  it('should return 400 when txHash or network is missing', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/transaction/detail')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken)
      .send({ txHash: '' });

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing txHash or network in the request body!'));
  });

  it('should fetch transaction history successfully for a valid address and network', async () => {
    const address = '0x77af86669adfab004041c8ef0aa80a68ea1770e4';
    const network = 'polygon';

    const res = await request(app)
      .post('/api/v1/wallet/transaction/history')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken)
      .send({ address, network });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Transaction history fetched successfully!');

    assert.ok(Array.isArray(res.body.data));

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']]
    });

    assert.equal(lastRecord.action, 'GET_TRANSACTION_HISTORY');
  });

  it('should return 400 when address or network missing for transaction history', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/transaction/history')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken)
      .send({ address: '' });

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing address or network in the request body!'));
  });

  it('should convert from Fiat to ETH (from SGD)', async () => {
    const fiatCurrency = 'SGD';
    const cryptoSymbol = 'ETH';
    const amount = 1000;

    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ fiatCurrency, cryptoSymbol, amount });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Conversion succeed!');
  });

  it('should convert from Fiat to POL (from IDR)', async () => {
    const fiatCurrency = 'IDR';
    const cryptoSymbol = 'POL';
    const amount = 1000;

    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ fiatCurrency, cryptoSymbol, amount });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Conversion succeed!');
  });

  it('should fail when one of the body request is missing', async () => {
    const fiatCurrency = 'IDR';
    const cryptoSymbol = 'POL';

    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({ fiatCurrency, cryptoSymbol });

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing amount, fiatCurrency or cryptoSymbol!'));

  });

  it('should estimate gas for increment() successfully', async () => {
    const payload = {
      network: "sepolia",
      contractAddress: "0x604204fdE0bf9efB9F55439D2f75c218e20D1B8d",
      abi,
      method: "increment",
      params: [],
      from: "0x732874c027304f60a0561631cD615C34D82965a9"
    };

    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Estimation cost  fetched successfully!');
    assert.ok(Number(res.body.data.gasEstimate) > 0);

    const count = await Auditrail.count();
    const record = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']]
    });

    assert.equal(record.action, 'GET_ESTIMATION_COST');
  });

  it('should estimate gas for getTotalReceived() successfully', async () => {
    const payload = {
      network: "sepolia",
      contractAddress: "0x604204fdE0bf9efB9F55439D2f75c218e20D1B8d",
      abi,
      method: "getTotalReceived",
      params: [],
      from: "0x732874c027304f60a0561631cD615C34D82965a9"
    };

    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Estimation cost  fetched successfully!');
    assert.ok(Number(res.body.data.gasEstimate) > 0);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`)
      .send({});

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing required fields (network, contractAddress, abi, method, from)!'));
  });

  it('should return gas price for Ethereum', async () => {
    const res = await request(app)
      .get('/api/v1/wallet/gas-price?network=ethereum')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.network, 'ethereum');
    assert.ok(res.body.data.gasPrice);
    assert.ok(res.body.data.maxFeePerGas);
  });

  it('should return gas price for Polygon', async () => {
    const res = await request(app)
      .get('/api/v1/wallet/gas-price?network=polygon')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.network, 'polygon');
    assert.ok(res.body.data.gasPrice);
    assert.ok(res.body.data.maxFeePerGas);
  });

  it('should return 400 if network parameter is missing', async () => {
    const res = await request(app)
      .get('/api/v1/wallet/gas-price')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Query param network is required!'));
  });

});