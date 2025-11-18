class NetworkHelper {

    constructor() {
        // todo : need to check and find the API key
        this.networks = {
            ethereum: `https://mainnet.infura.io/v3/${  process.env.INFURA_API_KEY}`, 
            polygon: `https://polygon-mainnet.infura.io/v3/${  process.env.INFURA_API_KEY}`,
            sepolia: `https://sepolia.infura.io/v3/${  process.env.INFURA_API_KEY}`,
            amoy: `https://polygon-amoy.infura.io/v3/${  process.env.INFURA_API_KEY}`,
            mainnet: `https://mainnet.infura.io/v3/${  process.env.INFURA_API_KEY}`,
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