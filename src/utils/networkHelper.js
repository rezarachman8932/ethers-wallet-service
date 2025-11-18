class NetworkHelper {

    constructor() {
        this.networks = {
            ethereum: 'https://eth.llamarpc.com',
            polygon: 'https://polygon.llamarpc.com',
        };

        this.networkTransactionHistoryUrls = {
            ethereum: 'https://api.etherscan.io/api',
            polygon: 'https://api.polygonscan.com/api',
        };

        this.networkTransactionApiKeys = {
            ethereum: process.env.ETHERSCAN_API_KEY,
            polygon: process.env.POLYGONSCAN_API_KEY,
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

    getTransactionHistoryUrl(network) {
        if (!network) {
            throw new Error("Network parameter is required!");
        }

        const url = this.networkTransactionHistoryUrls[network.toLowerCase()];
        if (!url) {
            throw new Error("Base URL doesn't exists. Please use 'ethereum' or 'polygon' network.");
        }
        
        return url;
    }

    getTransactionApiKey(network) {
        if (!network) {
            throw new Error("Network parameter is required!");
        }

        const apiKey = this.networkTransactionApiKeys[network.toLowerCase()];
        if (!apiKey) {
            throw new Error("API key doesn't exists. Please use 'ethereum' or 'polygon' network.");
        }
        
        return apiKey;
    }

}

module.exports = new NetworkHelper();