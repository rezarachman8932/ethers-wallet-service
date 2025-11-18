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
    
    async getTransactionDetail(txHash, network) {
        const rpcUrl = networkHelper.getRpcUrl(network);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!tx) throw new Error("Transaction not found");
        return { tx, receipt };
    }

}

module.exports = new EthersServices();