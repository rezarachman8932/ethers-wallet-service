import { ethers } from "ethers";

const wallet = new ethers.Wallet(
  // "0x1b3d9046d5de649e6460e5c2e13de084bb4623d5025733d3eb73bdbae48c7298"
  "0xfe91b32115f23b060e695cc7b662d595c2ccdecdb89553a1c4a658cb8bec9873"
);

console.log(wallet.address);