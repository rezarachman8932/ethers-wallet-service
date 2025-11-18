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
    this.timeout(10000);

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
});
