const request = require('supertest');
const assert = require('assert');
const app = require('../src/server');
const { generateToken, generateSignatureKey } = require('../src/utils/helper');
const { ethers } = require('ethers');

const models = require('../src/databases/models');
const Platform = models.Platform;
const Auditrail = models.Auditrail;

describe('POST /api/v1/wallet/call/smart-contract', () => {
  let validAccessKey, token;

  before(async function () {
    this.timeout(2000);

    const platform = await Platform.create({
      name: 'Smart Contract Call Test',
      description: 'Test call smart contract',
    });

    validAccessKey = platform.accessKey;
    token = generateToken(platform.uuid, validAccessKey);
  });

  const abiStateChanging = [
    {
      "inputs": [
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "string", "name": "uri", "type": "string" },
        { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
        { "internalType": "bytes32", "name": "documentHash", "type": "bytes32" }
      ],
      "name": "issueDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
  ];

  const basePayload = {
    network: 'sepolia',
    contractAddress: '0xFC360E992B9A6007b0F862f9ff1313FE18fEeCa7'
  };

  /**
   * ✅ READ
   */
  // it('should call read-only contract method successfully', async function () {
  //   const payload = {
  //     ...basePayload,
  //     method: 'getTotalReceived',
  //     params: [],
  //   };

  //   const signatureKey = generateSignatureKey(payload, token);

  //   const res = await request(app)
  //     .post('/api/v1/wallet/call/smart-contract')
  //     .set('Accept', 'application/json')
  //     .set('x-wallet-access-key', validAccessKey)
  //     .set('authorization', `Bearer ${signatureKey}`)
  //     .send(payload);

  //   assert.equal(res.status, 200);
  //   assert.equal(res.body.message, 'Smart contract method executed successfully!');
  //   assert.equal(res.body.data.type, 'read');
  //   assert.ok(res.body.data.result !== undefined);

  //   const count = await Auditrail.count();
  //   const record = await Auditrail.findOne({
  //     offset: count - 1,
  //     order: [['id', 'ASC']],
  //   });

  //   assert.equal(record.action, 'CALL_SMART_CONTRACT_METHOD');
  // });

  /**
   * ✅ WRITE
   */
  it('should call write / state-changed contract method successfully', async function () {
    this.timeout(30000);

    const now = Math.floor(Date.now() / 1000);
    const documentContent = `Test Document Content @ ${now}`;
    const documentHash = ethers.keccak256(
      ethers.toUtf8Bytes(documentContent)
    );
    const expiresAt = now + 365 * 24 * 60 * 60;

    const payload = {
      ...basePayload,
      abi: abiStateChanging,
      privateKey: "0x1b3d9046d5de649e6460e5c2e13de084bb4623d5025733d3eb73bdbae48c7298",
      method: "issueDocument",
      params: [
        "0xead9277CD7Bf281806155089E82391b2B56AbB7b",
        "https://storage.googleapis.com/asset-demo-arvie/metadata-0021dafb-74f7-4b80-b11b-f742e412ae9f.json",
        expiresAt,
        documentHash
      ]
    };

    const signatureKey = generateSignatureKey(payload, token);

    const res = await request(app)
      .post('/api/v1/wallet/call/smart-contract')
      .set('Accept', 'application/json')
      .set('x-wallet-access-key', validAccessKey)
      .set('authorization', `Bearer ${signatureKey}`)
      .send(payload);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Smart contract method executed successfully!');
    assert.equal(res.body.data.type, 'write');
    assert.ok(res.body.data.txHash.startsWith('0x'));
    assert.ok(res.body.data.receipt);

    const count = await Auditrail.count();
    const record = await Auditrail.findOne({
      offset: count - 1,
      order: [['id', 'ASC']],
    });

    assert.equal(record.action, 'CALL_SMART_CONTRACT_METHOD');
  });

  /**
   * ❌ FAIL
   */
  // it('should fail when calling write method without privateKey', async () => {
  //   const payload = {
  //     ...basePayload,
  //     method: 'increment',
  //     params: [],
  //   };

  //   const signatureKey = generateSignatureKey(payload, token);

  //   const res = await request(app)
  //     .post('/api/v1/wallet/call/smart-contract')
  //     .set('Accept', 'application/json')
  //     .set('x-wallet-access-key', validAccessKey)
  //     .set('authorization', `Bearer ${signatureKey}`)
  //     .send(payload);

  //   assert.equal(res.status, 422);
  //   assert.ok(
  //     res.body.message.includes('Failed to execute smart contract method!')
  //   );
  //   assert.ok(
  //     res.body.error.includes('Private key required for state-changing methods!')
  //   );
  // });
});