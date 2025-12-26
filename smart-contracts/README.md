# 📄 EnterpriseDocumentNFT

A production-grade **ERC-721–based enterprise document registry** that enables secure issuance, transfer, access control, and verification of sensitive documents across wallets.

Designed for:
- 🏢 Enterprise document exchange  
- ⚖️ Legal & contracts  
- 🏥 Healthcare records & certificates  
- 🗂 Internal company records  

---

## ✨ Key Features

- **ERC-721 (NFT) based documents**
- **Role-based issuance** (ISSUER_ROLE)
- **Immutable metadata (frozen URI)**
- **Transfer with explicit acceptance**
- **Read access control with expiry**
- **On-chain revocation**
- **Cryptographic integrity verification**
- **Auditable & legally defensible**

---

## 🏗 Architecture Overview

```
Document (off-chain)
   ↓ hash
Metadata JSON (off-chain, immutable)
   ↓ tokenURI
EnterpriseDocumentNFT (on-chain)
```

Only hashes and metadata pointers are stored on-chain.  
Actual document content stays off-chain (IPFS / cloud / private storage).

---

## 📦 Tech Stack

- Solidity 0.8.24
- OpenZeppelin Contracts v5
- Foundry (build & deploy)
- ethers.js v6 (interaction)
- Sepolia testnet

---

## 📁 Project Structure

```
.
├─ src/
│  └─ EnterpriseDocumentNFT.sol
├─ script/
│  ├─ DeployEnterpriseDocumentNFT.s.sol
│  └─ js/
│     ├─ issueDocument.js
│     ├─ readDocument.js
│     ├─ abi.js
│     └─ getAddress.js
├─ test/
│  └─ EnterpriseDocumentNFT.t.sol
├─ .env
├─ foundry.toml
├─ foundry.lock
└─ README.md
```

---

## 🚀 Deployment Guide (Foundry)

### 1️⃣ Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2️⃣ Install Dependencies
```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### 3️⃣ Environment Variables

Create a `.env` file:
```env
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
INFURA_API_KEY=YOUR_INFURA_API_KEY
```

### 4️⃣ Deployment Script

```solidity
// script/DeployEnterpriseDocumentNFT.s.sol
pragma solidity ^0.8.24;

import { Script } from 'forge-std/Script.sol';
import { EnterpriseDocumentNFT } from 'src/EnterpriseDocumentNFT.sol';

contract DeployEnterpriseDocumentNFT is Script {
    function run() external {
        vm.startBroadcast();
        new EnterpriseDocumentNFT();
        vm.stopBroadcast();
    }
}
```

### 5️⃣ Deploy to Sepolia

```bash
forge script script/DeployEnterpriseDocumentNFT.s.sol \
  --rpc-url $SEPOLIA_RPC \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

Save the deployed contract address for later use.

---

## 🧪 Issuing a Document

```bash
node issueDocument.js
```

This script:
- Hashes the document
- Mints the NFT
- Assigns ownership to the receiver
- Freezes metadata
- Emits `DocumentIssued`

---

## 📥 Reading & Verifying a Document

```bash
node readDocument.js
```

This proves:
- Ownership or read access
- Metadata integrity
- Document authenticity via hash verification