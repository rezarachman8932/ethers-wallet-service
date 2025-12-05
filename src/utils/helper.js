const { isAddress, toChecksumAddress } = require('web3-utils');
const { keccak256 } = require('ethereumjs-util');
const randomize = require('randomatic');
const crypto = require('crypto');
const { hashSync, genSaltSync, compareSync } = require('bcrypt');
const networkHelper = require('../utils/networkHelper');
const { ethers } = require('ethers');

const isValidAddress = (address) => {
  try {
    return isAddress(toChecksumAddress(address));
  } catch (e) {
    console.error('Invalid address:', e);
    return false;
  }
};

const isValidCertificateHash = (input) => /^0x[a-fA-F0-9]{64}$/.test(input);

const combinedHash = (first, second) => {
  if (!second) {
    return toBuf(first);
  }
  if (!first) {
    return toBuf(second);
  }
  return keccak256(bufSortJoin(toBuf(first), toBuf(second)));
};

const randomaticPassword = (length) => {
  const random = randomize('*', length);
  return random;
};

const makeid = (length) => {
  const buf = crypto.randomBytes(length);
  return buf.toString('hex');
};

const bufSortJoin = (...args) => Buffer.concat([...args].sort(Buffer.compare));

const toBuf = (str) => {
  if (str instanceof Buffer) return str;
  return Buffer.from(str, 'hex');
};

const generateBcryptHash = (words) => {
  const hash = hashSync(words, genSaltSync(8), null);
  return hash;
};

const compareBcryptHash = (hashBcrypt, words) => {
  const result = compareSync(words, hashBcrypt);
  return result;
};

const generateToken = (uuid, accessKey) => {
  const combined = `${uuid}:${accessKey}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
};

/**
 * Generate Token — hashed from UUID + AccessKey
 * @returns {Object} { uuid, accessKey, token }
 */
const generatePlatformCredentials = () => {
  const uuid = crypto.randomUUID();
  const accessKey = makeid(32);
  const token = generateToken(uuid, accessKey);
  return { uuid, accessKey, token };
};

/**
 * Generate Signature Key — hashed from body + accessKey
 * @param {string} body - request body converted to string
 * @param {string} accessKey - platform access key
 * @returns {string} signatureKey
 */
const generateSignatureKey = (body, token) => {
  const combined = `${JSON.stringify(body)}:${token}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
};

const verifySignature = (body, token, signatureToCheck) => {
  const newSignature = generateSignatureKey(body, token);
  return newSignature === signatureToCheck;
};

const isContractAddress = async (network, address) => {
  const rpcUrl = networkHelper.getRpcUrl(network);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const code = await provider.getCode(address);
  return code && code !== '0x' && code !== '0x0';
};

const isEOAAddress = async (provider, address) => !(await isContractAddress(provider, address));

const checkAddressType = async (network, address) => {
  const rpcUrl = networkHelper.getRpcUrl(network);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const code = await provider.getCode(address);
  const isContract = code && code !== '0x' && code !== '0x0';
  return {
    isContract,
    isEOA: !isContract,
  };
};

module.exports = {
  isValidAddress,
  isValidCertificateHash,
  combinedHash,
  randomaticPassword,
  makeid,
  bufSortJoin,
  toBuf,
  generateBcryptHash,
  compareBcryptHash,
  generateToken,
  generatePlatformCredentials,
  generateSignatureKey,
  verifySignature,
  isContractAddress,
  isEOAAddress,
  checkAddressType,
};
