import { ethers } from "ethers";
import { ABI } from "./abi.js";
import "dotenv/config";

// ================== CONFIG ==================

const CONTRACT_ADDRESS = "0xFC360E992B9A6007b0F862f9ff1313FE18fEeCa7";
const TOKEN_ID = 3;
const USER_PRIVATE_KEY = process.env.PRIVATE_KEY;

// ============================================

async function main() {
  // 1️⃣ Provider
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);

  // 2️⃣ Wallet (receiver / viewer)
  const wallet = new ethers.Wallet(USER_PRIVATE_KEY, provider);
  console.log("Viewer address:", wallet.address);

  // 3️⃣ Contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  // 4️⃣ Check read access
  const hasAccess = await contract.hasReadAccess(TOKEN_ID, wallet.address);
  if (!hasAccess) {
    throw new Error("❌ This wallet does NOT have read access");
  }
  console.log("✅ Read access granted");

  // 5️⃣ Read on-chain metadata
  const meta = await contract.getDocumentMeta(TOKEN_ID);
  console.log("On-chain meta:", meta);

  // 6️⃣ Get tokenURI
  const tokenURI = await contract.tokenURI(TOKEN_ID);
  console.log("Token URI:", tokenURI);

  // 7️⃣ Fetch metadata JSON
  const metaRes = await fetch(tokenURI);
  if (!metaRes.ok) throw new Error("Failed to fetch metadata");

  const metadata = await metaRes.json();
  console.log("Metadata JSON:", metadata);

  // REQUIRED FIELDS
  const { document_url, document_hash } = metadata;
  if (!document_url || !document_hash) {
    throw new Error("Metadata missing document_url or document_hash");
  }

  // 8️⃣ Fetch actual document / message
  const docRes = await fetch(document_url);
  if (!docRes.ok) throw new Error("Failed to fetch document");

  const documentText = await docRes.text();
  console.log("\n📄 DOCUMENT CONTENT:\n");
  console.log(documentText);

  // 9️⃣ Verify integrity
  const calculatedHash = ethers.keccak256(
    ethers.toUtf8Bytes(documentText)
  );

  console.log("\n🔎 VERIFICATION");
  console.log("On-chain hash:", document_hash);
  console.log("Calculated hash:", calculatedHash);

  if (calculatedHash === document_hash) {
    console.log("✅ DOCUMENT IS AUTHENTIC");
  } else {
    console.log("❌ DOCUMENT WAS TAMPERED");
  }
}

main().catch(err => {
  console.error("ERROR:", err.message);
});