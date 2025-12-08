const { ethers, formatEther, formatUnits } = require('ethers');
const networkHelper = require('../utils/networkHelper');

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

    if (json.status === '0') {
      throw new Error(json.message || 'Failed to fetch transaction detail');
    }

    if (!json.result) {
      throw new Error('Transaction not found');
    }

    return json.result;
  }

  async estimateGasForContractMethod({
    privateKey,
    network,
    contractAddress,
    abi,
    method,
    params, // params can be a single value, an array, or an object with 'value'
  }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signerFromPrivateKey = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(contractAddress, abi, signerFromPrivateKey);

      let functionArgs = [];
      const overrides = {};

      if (params) {
        if (typeof params === 'object' && !Array.isArray(params) && params.value !== undefined) {
          overrides.value = ethers.parseEther(params.value.toString());
        } else if (Array.isArray(params)) {
          functionArgs = params;
        } else {
          functionArgs = [params];
        }
      }

      const gasEstimate = await contract[method].estimateGas(...functionArgs, overrides);
      const walletAddress = signerFromPrivateKey.address;
      const balance = await signerFromPrivateKey.provider.getBalance(walletAddress);
      const feeData = await signerFromPrivateKey.provider.getFeeData();
      const gasPrice = feeData.gasPrice || feeData.maxFeePerGas;
      const totalCost = gasEstimate * gasPrice;

      console.log(`Gas Limit Estimate: ${gasEstimate.toString()} units`);
      console.log(`Gas Price: ${formatUnits(gasPrice, 'gwei')} Gwei`);
      console.log(`Total Gas Cost: ${formatEther(totalCost)} ETH`);
      console.log(`Wallet Balance: ${formatEther(balance)} ETH`);

      const canPerformAction = balance > totalCost;
      console.log(`Can perform ${method} Transaction}: ${canPerformAction}`);

      return {
        gasEstimate: gasEstimate.toString(),
        gasPrice: formatUnits(gasPrice, 'gwei'),
        totalCost: formatEther(totalCost),
        canPerformAction,
      };
    } catch (error) {
      console.error('[EthersService] Gas estimation error:', error);
      throw new Error(
        error.reason || error.shortMessage || error.message || 'Failed to estimate gas'
      );
    }
  }

  async transferNativeToken({ network, to, amount, privateKey }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      const wallet = new ethers.Wallet(privateKey, provider);
      const valueInWei = ethers.parseEther(amount.toString());

      // Estimate gas using the wallet’s address
      const gasLimit = await provider.estimateGas({
        to,
        value: valueInWei,
        from: wallet.address,
      });

      // Optional 20% buffer (recommended in production)
      const GAS_BUFFER_NUMERATOR = 12n;
      const GAS_BUFFER_DENOMINATOR = 10n;
      const gasLimitBuffered = (gasLimit * GAS_BUFFER_NUMERATOR) / GAS_BUFFER_DENOMINATOR;

      const tx = await wallet.sendTransaction({
        to,
        value: valueInWei,
        gasLimit: gasLimitBuffered,
      });

      return {
        txHash: tx.hash,
        gasLimit: gasLimitBuffered.toString(),
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to transfer native token');
    }
  }

  async getGasPrice(network) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const feeData = await provider.getFeeData();
      return {
        network,
        gasPrice: feeData.gasPrice?.toString() || null,
        maxFeePerGas: feeData.maxFeePerGas?.toString() || null,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || null,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get gas price');
    }
  }

  async getLatestBlock(network) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlock('latest');
      return {
        network,
        block,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch latest block');
    }
  }

  async getBlockByHash({ network, hash }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlock(hash);
      return {
        network,
        block,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch block by hash');
    }
  }

  async getBlockByNumber({ network, blockNumber }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlock(Number(blockNumber));
      return {
        network,
        block,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch block by number');
    }
  }

  async estimateGasForTransfer({ network, to, amount, privateKey }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      const wallet = new ethers.Wallet(privateKey, provider);
      const value = ethers.parseEther(amount.toString());

      const gasLimit = await provider.estimateGas({
        to: to,
        value: value,
        from: wallet.address,
      });

      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      if (!gasPrice) throw new Error('Unable to get the gas price!');

      const totalGasWei = gasLimit * gasPrice;
      const totalGasEth = ethers.formatEther(totalGasWei);

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        totalGasWei: totalGasWei.toString(),
        totalGasEth: totalGasEth,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to estimate cost for transfer balance!');
    }
  }

  async getBlockWithTransactions({ network, hash }) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const block = await provider.getBlock(hash, true);
      return { network, block };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch block with full transactions!');
    }
  }

  async getNonce(address, network) {
    try {
      const rpcUrl = networkHelper.getRpcUrl(network);
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      const confirmedNonce = await provider.getTransactionCount(address, 'latest');
      const pendingNonce = await provider.getTransactionCount(address, 'pending');

      return {
        address,
        network,
        confirmedNonce,
        pendingNonce,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch nonce!');
    }
  }
}

module.exports = new EthersServices();
