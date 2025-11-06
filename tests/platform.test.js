const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { sequelize } = require('../src/databases/models');
const { execSync } = require('child_process');
const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;

describe('GET /api/v1/platform', () => {

  let validAccessKey, validToken;

  before(async function() {
    // Extend timeout for DB setup
    this.timeout(10000); 

    // Reset DB using Sequelize CLI migrations
    execSync('npx sequelize-cli db:drop', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

    // Seed a platform
    const platform = await Platform.create({
      name: 'Sample Platform',
      description: 'Test description',
      token: '5873495347534HSJAH898',
      accessKey: '479823789GHFFF84332KJHDFKJH',
    });

    validAccessKey = platform.accessKey;
    validToken = platform.token;
  });

  afterEach(async function() {
    await Auditrail.destroy({ where: {} });
  });

  after(async function() {
    await sequelize.close();
  });

  it('should return platform list and create an audit trail', async function() {
    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', 'Bearer ' + validToken);

    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.equal(res.body.status, true);
    assert.equal(res.body.message, 'get platform successfully!');
    assert.ok(Array.isArray(res.body.contents));
    assert.equal(res.body.contents.length, 1);

    const count = await Auditrail.count();
    assert.equal(count, 1);
  });

  it('should fail with 401 when missing headers', async function () {
    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json');

    assert.equal(res.status, 401);
    assert.equal(res.body.status, false);
    assert.ok(res.body.message.includes('Missing'));
  });

  it('should fail with 403 when credentials are invalid', async function () {
    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', 'wrong-access')
      .set('authorization', 'Bearer wrong-token');

    assert.equal(res.status, 403);
    assert.equal(res.body.status, false);
    assert.ok(res.body.message.includes('Invalid'));
  });

});