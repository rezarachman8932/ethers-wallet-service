const { isAddress, toChecksumAddress } = require("web3-utils");
const { keccak256 } = require("ethereumjs-util");
const randomize = require('randomatic');
const crypto = require("crypto");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const isValidAddress = address => {
    try {
        return isAddress(toChecksumAddress(address));
    } catch (e) {
        return false;
    }
};

const isValidCertificateHash = input => /^0x[a-fA-F0-9]{64}$/.test(input);

const combinedHash = (first, second) => {
    if (!second) {
        return toBuf(first);
    }
    if (!first) {
        return toBuf(second);
    }
    return keccak256(bufSortJoin(toBuf(first), toBuf(second)));
}

const randomaticPassword = (length) => {
    const random = randomize('*', length);
    return random;
}

const makeid = (length) => {
    const buf = crypto.randomBytes(length);
    return buf.toString("hex");
}

const bufSortJoin = (...args) => {
    return Buffer.concat([...args].sort(Buffer.compare));
}

const toBuf = (str) => {
    if (str instanceof Buffer) return str;
    return Buffer.from(str, "hex");
}

const generateBcryptHash = (words) => {
    let hash = hashSync(words, genSaltSync(8), null);
    return hash;
}

const compareBcryptHash = (hashBcrypt, words) => {
    let result = compareSync(words, hashBcrypt);
    return result;
}

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
};