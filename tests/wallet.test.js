const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { sequelize } = require('../src/databases/models');
const { generateToken, generateSignatureKey } = require('../src/utils/helper');
const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;

describe('POST /api/v1/wallet', () => {
  let validAccessKey, validSignatureKey, platformUuid, platformAccessKey, token;

  before(async function () {
    this.timeout(3000);

    const platform = await Platform.create({
      name: 'Wallet Test New Reza',
      description: 'Test description for wallet',
    });

    platformUuid = platform.uuid;
    platformAccessKey = platform.accessKey;
    token = generateToken(platformUuid, platformAccessKey);

    const body = {};
    const signatureKey = generateSignatureKey(body, token);

    validAccessKey = platformAccessKey;
    validSignatureKey = signatureKey;
  });

  after(async () => {
    await sequelize.close();
  });

  const abi = [
    {
      inputs: [],
      name: 'increment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getTotalReceived',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  it('should create a new wallet successfully', async () => {
    const res = await request(app)
      .post('/api/v1/wallet')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validSignatureKey}`);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'New wallet created successfully!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.ok(typeof res.body.data.mnemonic === 'string');

    const count = await Auditrail.count();
    const secondRecord = await Auditrail.findOne({
      offset: 2,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 3);
    assert.equal(secondRecord.action, 'CREATE_WALLET');
  });

  it('should return wallet data from private key successfully', async () => {
    const privateKey = '0x4c0883a6910395b8b6a1237e9c31c7b03cbe0b5c7f8d9a8c2a66c475f8c6f0a9';
    const body = { privateKey };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/private')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Wallet retrieved successfully from private key!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.equal(res.body.data.privateKey, privateKey);

    const count = await Auditrail.count();
    const thirdRecord = await Auditrail.findOne({
      offset: 3,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 4);
    assert.equal(thirdRecord.action, 'GET_WALLET_BY_PRIVATE_KEY');
  });

  it('should return 400 if private key missing', async () => {
    const body = {};
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/private')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing private key in the request body!'));
  });

  it('should return wallet data from mnemonic successfully', async () => {
    const mnemonic = 'test test test test test test test test test test test junk';
    const body = { mnemonic };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/mnemonic')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Wallet retrieved successfully from mnemonic!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.equal(res.body.data.mnemonic, mnemonic);

    const count = await Auditrail.count();
    const fourthRecord = await Auditrail.findOne({
      offset: 4,
      order: [['id', 'ASC']],
    });

    assert.equal(count, 5);
    assert.equal(fourthRecord.action, 'GET_WALLET_BY_MNEMONIC');
  });

  it('should return 400 if mnemonic missing', async () => {
    const body = {};
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/mnemonic')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing mnemonic in the request body!'));
  });

  it('should fetch balance successfully for a valid address and network', async function () {
    this.timeout(2000);

    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const network = 'ethereum';

    const body = { address, network };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/balance')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Balance fetched successfully!');
  });

  it('should fail when address or network is missing', async () => {
    const body = { address: '' };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/balance')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing address or network in the request body!'));
  });

  it('should fetch transaction detail successfully for a valid txHash and network', async function () {
    this.timeout(3000);

    const txHash = '0x3384291afad5486985d0d79be408b0dc1bfa6b703ae728135ff57038c524dd1d';
    const network = 'polygon';
    const body = { txHash, network };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/transaction/detail')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('Authorization', 'Bearer ' + signatureKey)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Transaction detail fetched successfully!');

    assert.ok(typeof res.body.data === 'object');
    assert.equal(res.body.data.hash?.toLowerCase(), txHash.toLowerCase());

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'GET_TRANSACTION_HISTORY_DETAIL');
  });

  it('should return 400 when txHash or network is missing', async () => {
    const body = { txHash: '' };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/transaction/detail')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + signatureKey)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing txHash or network in the request body!'));
  });

  it('should fetch transaction history successfully for a valid address and network', async () => {
    const address = '0x77af86669adfab004041c8ef0aa80a68ea1770e4';
    const network = 'polygon';
    const body = { address, network };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/transaction/history')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + signatureKey)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Transaction history fetched successfully!');

    assert.ok(Array.isArray(res.body.data));

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'GET_TRANSACTION_HISTORY');
  });

  it('should return 400 when address or network missing for transaction history', async () => {
    const body = { address: '' };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/transaction/history')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + signatureKey)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing address or network in the request body!'));
  });

  it('should convert from Fiat to ETH (from SGD)', async function () {
    this.timeout(2000);

    const fiatCurrency = 'SGD';
    const cryptoSymbol = 'ETH';
    const amount = 1000;
    const body = { fiatCurrency, cryptoSymbol, amount };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Conversion succeed!');
  });

  it('should convert from Fiat to POL (from IDR)', async function () {
    this.timeout(2000);

    const fiatCurrency = 'IDR';
    const cryptoSymbol = 'POL';
    const amount = 1000;
    const body = { fiatCurrency, cryptoSymbol, amount };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Conversion succeed!');
  });

  it('should fail when one of the body request is missing', async () => {
    const fiatCurrency = 'IDR';
    const cryptoSymbol = 'POL';
    const body = { fiatCurrency, cryptoSymbol };
    const signatureKey = generateSignatureKey(body, token);
    const res = await request(app)
      .post('/api/v1/wallet/convert')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing amount, fiatCurrency or cryptoSymbol!'));
  });

  it('should estimate gas for increment() successfully', async function () {
    this.timeout(3000);

    const payload = {
      privateKey: '322d52b9158b4351a7a85d2f2d316e6c81183de286c1531dbce7a5340a3f03d6',
      network: 'sepolia',
      contractAddress: '0x604204fdE0bf9efB9F55439D2f75c218e20D1B8d',
      abi,
      method: 'increment',
      params: [],
    };

    const signatureKey = generateSignatureKey(payload, token);

    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Estimation cost  fetched successfully!');
    assert.ok(Number(res.body.data.gasEstimate) > 0);

    const count = await Auditrail.count();
    const record = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(record.action, 'GET_ESTIMATION_COST');
  });

  it('should estimate gas for getTotalReceived() successfully', async () => {
    const payload = {
      privateKey: '322d52b9158b4351a7a85d2f2d316e6c81183de286c1531dbce7a5340a3f03d6',
      network: 'sepolia',
      contractAddress: '0x604204fdE0bf9efB9F55439D2f75c218e20D1B8d',
      abi,
      method: 'getTotalReceived',
      params: [],
    };

    const signatureKey = generateSignatureKey(payload, token);

    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Estimation cost  fetched successfully!');
    assert.ok(Number(res.body.data.gasEstimate) > 0);
  });

  it('should return 400 when required fields are missing', async () => {
    const body = {};
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/estimate')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 400);
    assert.ok(
      res.body.message.includes(
        'Missing required fields (network, contractAddress, abi, method, from)!'
      )
    );
  });

  it('should return gas price for Ethereum', async () => {
    const signatureKey = generateSignatureKey({}, token);

    const res = await request(app)
      .get('/api/v1/wallet/gas-price?network=ethereum')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.network, 'ethereum');
    assert.ok(res.body.data.gasPrice);
    assert.ok(res.body.data.maxFeePerGas);
  });

  it('should return gas price for Polygon', async function () {
    this.timeout(5000);

    const signatureKey = generateSignatureKey({}, token);

    const res = await request(app)
      .get('/api/v1/wallet/gas-price?network=polygon')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.network, 'polygon');
    assert.ok(res.body.data.gasPrice);
    assert.ok(res.body.data.maxFeePerGas);
  });

  it('should return 400 if network parameter is missing', async () => {
    const signatureKey = generateSignatureKey({}, token);
    const res = await request(app)
      .get('/api/v1/wallet/gas-price')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Query param network is required!'));
  });

  it('should transfer native token successfully', async function () {
    this.timeout(3000);

    const body = {
      network: 'sepolia',
      to: '0xead9277CD7Bf281806155089E82391b2B56AbB7b',
      amount: '0.0001',
      privateKey: '0x1b3d9046d5de649e6460e5c2e13de084bb4623d5025733d3eb73bdbae48c7298',
    };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/transfer')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Balance transferred successfully!');
    assert.ok(res.body.data.txHash.startsWith('0x'));
    assert.ok(BigInt(res.body.data.gasLimit) > 0n);

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'TRANSFER_BALANCE');
  });

  it('should fetch the latest block successfully', async () => {
    const network = 'ethereum';
    const signatureKey = generateSignatureKey({}, token);
    const res = await request(app)
      .get('/api/v1/wallet/block/latest')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .query({ network });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Latest block fetched successfully!');
    assert.ok(res.body.data.block);
    assert.ok(res.body.data.block.number >= 0);
  });

  it('should return 400 when network missing for latest block', async () => {
    const signatureKey = generateSignatureKey({}, token);
    const res = await request(app)
      .get('/api/v1/wallet/block/latest')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes("Query parameter of 'network' is required!"));
  });

  it('should fetch the block by hash successfully', async () => {
    const network = 'polygon';
    const hash = '0x3b95830c8752b3138142e89e720c6106acf4d6e0bd486354df6c095b6f0d36a5';
    const signatureKey = generateSignatureKey({}, token);
    const res = await request(app)
      .get('/api/v1/wallet/block/hash')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .query({ network, hash });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Block fetched by hash successfully!');
    assert.ok(res.body.data.block);
    assert.ok(res.body.data.block.number >= 0);
  });

  it('should fetch the block by number successfully', async () => {
    const network = 'polygon';
    const blockNumber = '72551865';
    const signatureKey = generateSignatureKey({}, token);
    const res = await request(app)
      .get('/api/v1/wallet/block/number')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .query({ network, blockNumber });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Block fetched by number successfully!');
    assert.ok(res.body.data.block);
    assert.ok(res.body.data.block.number >= 0);
  });

  it('should get the estimation cost for transfer balance successfully', async function () {
    const body = {
      network: 'sepolia',
      to: '0xead9277CD7Bf281806155089E82391b2B56AbB7b',
      amount: '0.0001',
      privateKey: '0x1b3d9046d5de649e6460e5c2e13de084bb4623d5025733d3eb73bdbae48c7298',
    };

    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/estimate/gas')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Estimation cost for transfer balance fetched successfully!');

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'GET_ESTIMATION_COST_TRANSFER_BALANCE');
  });

  it('should get block with transactions successfully', async function () {
    const network = 'polygon';
    const hash = '0x3b95830c8752b3138142e89e720c6106acf4d6e0bd486354df6c095b6f0d36a5';

    const signatureKey = generateSignatureKey({}, token);

    const res = await request(app)
      .get('/api/v1/wallet/block/transactions')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .query({ network, hash });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Block with full transactions fetched successfully!');

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'GET_BLOCK_WITH_TRANSACTIONS');
  });

  it('should fetch nonce successfully', async () => {
    const body = {
      network: 'ethereum',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    };
    const signatureKey = generateSignatureKey(body, token);

    const res = await request(app)
      .post('/api/v1/wallet/nonce')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(body);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Nonce fetched successfully!');

    const count = await Auditrail.count();
    const lastRecord = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(lastRecord.action, 'GET_NONCE');
  });
});
