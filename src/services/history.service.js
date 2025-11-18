const networkHelper = require("../utils/networkHelper");

class HistoryService {

    async getHistoryByAddress(address, network) {
        const baseUrl = networkHelper.getTransactionHistoryUrl(network);
        const apiKey  = networkHelper.getTransactionApiKey(network);

        const url = `${baseUrl}?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;

        const resp = await fetch(url);
        const json = await resp.json();

        if (json.status !== "1") {
            throw new Error(json.message || "Failed to fetch history");
        }

        return json.result;
    }

}

module.exports = new HistoryService();