const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { execSync } = require('child_process');
const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;
const crypto = require('crypto');
const { generatePlatformCredentials } = require('../src/utils/helper');
const { generateToken } = require('../src/utils/helper');

describe('GET /api/v1/platform', () => {
  let validAccessKey, validToken;

  before(async function () {
    this.timeout(10000);

    // Reset DB
    execSync('npx sequelize-cli db:drop', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

    // Generate platform credentials
    const { uuid, accessKey, token } = generatePlatformCredentials();

    previousUUID = uuid;
    previousAccessKey = accessKey;

    // Seed the Platform
    const platform = await Platform.create({
      uuid,
      name: 'Sample Platform',
      description: 'Test description',
      token,
      accessKey,
    });

    validAccessKey = platform.accessKey;
    validToken = platform.token;
  });

  it('should return platform list and create an audit trail', async () => {
    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.equal(res.body.message, 'Get platform successfully!');
    assert.equal(generateToken(previousUUID, previousAccessKey), validToken);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length, 1);

    const count = await Auditrail.count();
    assert.equal(count, 1);
  });

  it('should fail with 401 when missing headers', async () => {
    const res = await request(app).get('/api/v1/platform').set('Accept', 'application/json');

    assert.equal(res.status, 401);
    assert.ok(res.body.message.includes('Missing'));
  });

  it('should fail with 403 when invalid token for valid access key', async () => {
    const wrongToken = crypto.createHash('sha256').update('fake:combo').digest('hex');

    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${wrongToken}`);

    assert.equal(res.status, 403);
    assert.ok(res.body.message.includes('or auth token!'));
  });

  it('should fail with 403 when access key not found', async () => {
    const res = await request(app)
      .get('/api/v1/platform')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', 'non-existent-access-key')
      .set('authorization', `Bearer ${validToken}`);

    assert.equal(res.status, 403);
    assert.ok(res.body.message.includes('Invalid access key'));
  });
});
