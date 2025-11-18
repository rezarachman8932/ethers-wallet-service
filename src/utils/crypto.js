require("dotenv").config();
const CryptoJs = require("crypto-js");

/**
 * Encrypted
 * @param {Text} value plain text
 * @param {Text} secretKey encrypted key
 * @returns 
 */
const Encrypted = (value, secretKey) => {
    if (!secretKey) {
        secretKey = process.env.SECRET_KEY
    }
    const chipertext = CryptoJs.AES.encrypt(value.toString(), secretKey).toString()
    return chipertext
}

/**
 * Decrypted
 * @param {Text} value plain text
 * @param {Text} secretKey encrypted key
 * @returns 
 */
const Decrypted = (value, secretKey) => {
    if (!secretKey) {
        secretKey = process.env.SECRET_KEY
    }
    const bytes = CryptoJs.AES.decrypt(value.toString(), secretKey);
    const originalText = bytes.toString(CryptoJs.enc.Utf8);
    return originalText
}

module.exports = {
    Encrypted,
    Decrypted
}