import { ethers } from "ethers";
import { ABI } from "./abi.js";
import "dotenv/config";

const RECIPIENT = "0xead9277CD7Bf281806155089E82391b2B56AbB7b";
const CONTRACT_ADDRESS = "0xFC360E992B9A6007b0F862f9ff1313FE18fEeCa7";

// Example IPFS metadata URI
const TOKEN_URI = "https://storage.googleapis.com/asset-demo-arvie/metadata-0021dafb-74f7-4b80-b11b-f742e412ae9f.json";

// No expiration (0 = never expires)
const EXPIRES_AT = 0;

// Example document content (for hashing)
const DOCUMENT_CONTENT = "Test Dec 24";

async function main() {
  // 1️⃣ Provider (Sepolia)
  const provider = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_RPC
  );

  // 2️⃣ Signer (issuer wallet — MUST have ISSUER_ROLE)
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
  );

  console.log("Using issuer:", wallet.address);

  // 3️⃣ Contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    wallet
  );

  // 4️⃣ Generate document hash (bytes32)
  const documentHash = ethers.keccak256(
    ethers.toUtf8Bytes(DOCUMENT_CONTENT)
  );

  console.log("Document hash:", documentHash);

  // 5️⃣ Call issueDocument
  const tx = await contract.issueDocument(
    RECIPIENT,
    TOKEN_URI,
    EXPIRES_AT,
    documentHash
  );

  console.log("Transaction sent:", tx.hash);

  // 6️⃣ Wait for confirmation
  const receipt = await tx.wait();

  console.log("Transaction confirmed in block:", receipt.blockNumber);
  console.log("Transaction:", tx);
  console.log("Receipt Logs:", receipt.logs);

  // 7️⃣ Read event to get tokenId
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed.name === "DocumentIssued") {
        console.log("✅ Document issued");
        console.log("Token ID:", parsed.args.tokenId.toString());
        console.log("Owner:", parsed.args.owner);
      }
    } catch { }
  }
}

main().catch(console.error);