const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { sequelize } = require('../src/databases/models');
const { execSync } = require('child_process');
const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;

describe('GET /api/v1/platform', () => {

  before(async function() {
    // Extend timeout for DB setup
    this.timeout(10000); 

    // Reset DB using Sequelize CLI migrations
    execSync('npx sequelize-cli db:drop', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:create', { stdio: 'inherit' });
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

    // Seed a platform
    await Platform.create({
      name: 'Sample Platform',
      description: 'Test description',
      token: 'test-token',
      accessKey: 'test-access',
    });
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
      .set('Accept', 'application/json');

    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.equal(res.body.status, true);
    assert.equal(res.body.message, 'get platform successfully!');
    assert.ok(Array.isArray(res.body.contents));
    assert.equal(res.body.contents.length, 1);

    const count = await Auditrail.count();
    assert.equal(count, 1);
  });
});