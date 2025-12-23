// SPDX-License-Identifier: MIT
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
