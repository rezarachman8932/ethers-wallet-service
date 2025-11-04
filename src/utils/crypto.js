require("dotenv").config();
const CryptoJs = require("crypto-js");

/**
 * Encrypted
 * @param {Text} value plain text
 * @param {Text} secret_key encrypted key
 * @returns 
 */
const Encrypted = (value, secret_key) => {
    if (!secret_key) {
        secret_key = process.env.SECRET_KEY
    }
    let chipertext = CryptoJs.AES.encrypt(value.toString(), secret_key).toString()
    return chipertext
}

/**
 * Decrypted
 * @param {Text} value plain text
 * @param {Text} secret_key encrypted key
 * @returns 
 */
const Decrypted = (value, secret_key) => {
    if (!secret_key) {
        secret_key = process.env.SECRET_KEY
    }
    let bytes = CryptoJs.AES.decrypt(value.toString(), secret_key);
    let originalText = bytes.toString(CryptoJs.enc.Utf8);
    return originalText
}

module.exports = {
    Encrypted,
    Decrypted
}