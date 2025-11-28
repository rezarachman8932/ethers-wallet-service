const { generateToken, generateSignatureKey, verifySignature } = require('./src/utils/helper');
// test on local server
const uuid = '50c257cc-8575-4e1c-a7c8-4ffe6beedf49';
const accessKey = '644b6e01334a73ca66c55b7a00503163a94a60f81198f1301708ba5a510a3d46';

const token = generateToken(uuid, accessKey);
const body = {};
const signatureKey = generateSignatureKey(body, token);
const isValidSignature = verifySignature(body, token, signatureKey);

console.warn('signature key:', signatureKey);
console.warn('Is valid signature:', isValidSignature);
