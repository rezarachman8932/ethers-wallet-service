// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EnterpriseDocumentNFT } from 'src/EnterpriseDocumentNFT.sol';
import { Test } from 'forge-std/Test.sol';

/**
 * @title EnterpriseDocumentNFTTest
 * @notice Security- and behavior-focused tests for EnterpriseDocumentNFT
 * @dev Each test corresponds to a business or security invariant
 */
contract EnterpriseDocumentNFTTest is Test {
  EnterpriseDocumentNFT nft;

  address admin = address(0xA1);
  address issuer = address(0xB2);
  address alice = address(0xC3);
  address bob = address(0xD4);
  address eve = address(0xE5);

  function setUp() public {
    vm.prank(admin);
    nft = new EnterpriseDocumentNFT();

    vm.prank(admin);
    nft.addIssuer(issuer);
  }

  /* ============================================================
                            ISSUANCE
       ============================================================ */

  function testIssuerCanIssueDocument() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-1', 0, keccak256('doc-1'));

    assertEq(nft.ownerOf(tokenId), alice);
    assertTrue(nft.isValid(tokenId));
  }

  function testNonIssuerCannotIssue() public {
    vm.prank(eve);
    vm.expectRevert();
    nft.issueDocument(alice, 'ipfs://doc-x', 0, keccak256('doc-x'));
  }

  function testDuplicateDocumentHashRejected() public {
    bytes32 hash = keccak256('dup-doc');

    vm.prank(issuer);
    nft.issueDocument(alice, 'ipfs://doc', 0, hash);

    vm.prank(issuer);
    vm.expectRevert('Document already issued');
    nft.issueDocument(bob, 'ipfs://doc', 0, hash);
  }

  /* ============================================================
                      TRANSFER WITH ACCEPTANCE
       ============================================================ */

  function _issueDocumentToAlice() internal returns (uint256) {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://QmExampleCID', 0, keccak256('doc-1'));
    return tokenId;
  }

  function testTransferRequiresAcceptance() public {
    uint256 tokenId = _issueDocumentToAlice();

    vm.prank(alice);
    vm.expectRevert('Transfer not accepted');
    nft.transferFrom(alice, bob, tokenId);
  }

  function testAcceptedTransferSucceeds() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-3', 0, keccak256('doc-3'));

    vm.prank(alice);
    nft.requestTransfer(tokenId, bob);

    vm.prank(bob);
    nft.acceptTransfer(tokenId);

    assertEq(nft.ownerOf(tokenId), bob);
  }

  function testPendingTransferCannotBeOverwritten() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-4', 0, keccak256('doc-4'));

    vm.prank(alice);
    nft.requestTransfer(tokenId, bob);

    vm.prank(alice);
    vm.expectRevert('Transfer already pending');
    nft.requestTransfer(tokenId, eve);
  }

  /* ============================================================
                            REVOCATION
       ============================================================ */

  function testIssuerCanRevokeOwnDocument() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-5', 0, keccak256('doc-5'));

    vm.prank(issuer);
    nft.revokeDocument(tokenId);

    assertFalse(nft.isValid(tokenId));
  }

  function testOtherIssuerCannotRevoke() public {
    address otherIssuer = address(0xF6);

    vm.prank(admin);
    nft.addIssuer(otherIssuer);

    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-6', 0, keccak256('doc-6'));

    vm.prank(otherIssuer);
    vm.expectRevert('Not document issuer');
    nft.revokeDocument(tokenId);
  }

  function testAdminCanRevokeAnyDocument() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-7', 0, keccak256('doc-7'));

    vm.prank(admin);
    nft.revokeDocument(tokenId);

    assertFalse(nft.isValid(tokenId));
  }

  /* ============================================================
                            READ ACCESS
       ============================================================ */

  function testOwnerAlwaysHasReadAccess() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-8', 0, keccak256('doc-8'));

    assertTrue(nft.hasReadAccess(tokenId, alice));
  }

  function testGrantedReadAccessExpires() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-9', 0, keccak256('doc-9'));

    vm.prank(alice);
    nft.grantReadAccess(tokenId, bob, block.timestamp + 10);

    assertTrue(nft.hasReadAccess(tokenId, bob));

    vm.warp(block.timestamp + 11);
    assertFalse(nft.hasReadAccess(tokenId, bob));
  }

  function testRevokedDocumentHasNoReadAccess() public {
    vm.prank(issuer);
    uint256 tokenId = nft.issueDocument(alice, 'ipfs://doc-10', 0, keccak256('doc-10'));

    vm.prank(issuer);
    nft.revokeDocument(tokenId);

    assertFalse(nft.hasReadAccess(tokenId, alice));
  }

  /* ============================================================
                            VALIDITY
       ============================================================ */

  function testNonExistentTokenIsInvalid() public view {
    assertFalse(nft.isValid(9999));
  }
}
