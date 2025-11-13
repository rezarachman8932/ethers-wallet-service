const { StatusCodes } = require('http-status-codes');

class NetworkHelper {

    constructor() {
        this.networks = {
            ethereum: 'https://eth.llamarpc.com',
            polygon: 'https://polygon.llamarpc.com',
        };
    }

    /**
     * Get RPC URL by network name
     * @param {string} network - network name (e.g., 'ethereum', 'polygon')
     * @returns {string} rpcUrl
     * @throws Error if network not supported
    */
    getRpcUrl(network) {
        if (!network) {
            throw new Error("Network parameter is required!");
        }

        const rpcUrl = this.networks[network.toLowerCase()];
        if (!rpcUrl) {
            throw new Error("Unsupported network. Please use 'ethereum' or 'polygon'.");
        }
        
        return rpcUrl;
    }

}

module.exports = new NetworkHelper();