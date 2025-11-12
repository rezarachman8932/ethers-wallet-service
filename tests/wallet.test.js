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

  before(async function() {
    this.timeout(10000);

    const { uuid, accessKey, token } = generatePlatformCredentials();
    const platform = await Platform.create({ uuid, name: 'Wallet Test New Reza', token, accessKey });

    validAccessKey = platform.accessKey;
    validToken = platform.token;
  });
  
  after(async function() {
    await sequelize.close();
  });

  it('should create a new wallet successfully', async () => {
    const res = await request(app)
      .post('/api/v1/wallet')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'New wallet created successfully!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.ok(typeof res.body.data.mnemonic === 'string');

    const count = await Auditrail.count();
    const secondRecord = await Auditrail.findOne({
      offset: 1,
      order: [['id', 'ASC']]
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
      .set('authorization', 'Bearer ' + validToken)
      .send({ privateKey });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Wallet retrieved successfully from private key!');
    assert.ok(res.body.data.address.startsWith('0x'));
    assert.ok(res.body.data.privateKey.startsWith('0x'));
    assert.equal(res.body.data.privateKey, privateKey);

    const count = await Auditrail.count();
    const thirdRecord = await Auditrail.findOne({
      offset: 2,
      order: [['id', 'ASC']]
    });

    assert.equal(count, 3);
    assert.equal(thirdRecord.action, 'GET_WALLET_BY_PRIVATE_KEY');
  });

  it('should return 400 if private key missing', async function () {
    const res = await request(app)
      .post('/api/v1/wallet/private')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken)
      .send({});

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Missing private key in the request body!'));
  });
  
});