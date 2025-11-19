const { ethers } = require("ethers");
const networkHelper = require("../utils/networkHelper");

class EthersServices {

    createWallet() {
        const wallet = ethers.Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase,
        };
    }

    getWalletByPrivateKey(privateKey) {
        const wallet = new ethers.Wallet(privateKey);
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
    }

    getWalletByMnemonic(mnemonic) {
        const wallet = ethers.Wallet.fromPhrase(mnemonic);
        return {
            address: wallet.address,
            mnemonic: wallet.mnemonic?.phrase,
            privateKey: wallet.privateKey,
        };
    }

    async getBalance(address, network) {
        const rpcUrl = networkHelper.getRpcUrl(network);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        return {
            address,
            network,
            balanceWei: balanceWei.toString(),
            balanceEth,
        };
    }
    
    async getTransactionDetailByHash(txHash, network) {
        const { apiUrl, apiKey, chainId } = networkHelper.getExplorerConfig(network);
        const url =
            `${apiUrl}?chainid=${chainId}` +
            `&module=proxy` +
            `&action=eth_getTransactionByHash` +
            `&txhash=${txHash}` +
            `&apikey=${apiKey}`;

        const response = await fetch(url);
        const json = await response.json();

        if (!json.result) {
            throw new Error(json.message || "Failed to fetch transaction detail");
        }

        return json.result;
    }

}

module.exports = new EthersServices();