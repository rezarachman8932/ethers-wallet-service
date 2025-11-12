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
  
});