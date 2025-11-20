const networkHelper = require("../utils/networkHelper");

class HistoryService {

    async getTransactionsByAddress(address, network) {
        const { apiUrl, apiKey, chainId } = networkHelper.getExplorerConfig(network);

        const url =
            `${apiUrl}?chainid=${chainId}` +
            `&module=account` +
            `&action=txlist` +
            `&address=${address}` +
            `&startblock=0` +
            `&endblock=99999999` +
            `&sort=desc` +
            `&apikey=${apiKey}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === "0" || !Array.isArray(json.result)) {
            throw new Error(json.message || "Failed to fetch transaction history");
        }

        return json.result;
    }

}

module.exports = new HistoryService();