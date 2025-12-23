// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import { ERC721URIStorage } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import { AccessControl } from '@openzeppelin/contracts/access/AccessControl.sol';

/**
 * @title EnterpriseDocumentNFT
 * @notice ERC-721 for transferable enterprise records
 * @dev OpenZeppelin v5 compatible, transfer-with-acceptance enforced
 */
contract EnterpriseDocumentNFT is ERC721URIStorage, AccessControl {
  /* ============================================================
                                ROLES
       ============================================================ */

  /// @notice Issuers can issue and revoke documents
  bytes32 public constant ISSUER_ROLE = keccak256('ISSUER_ROLE');

  /* ============================================================
                                STATE
       ============================================================ */

  uint256 private _tokenIdCounter;

  struct DocumentMeta {
    uint256 issuedAt;
    uint256 expiresAt; // 0 = never expires
    bool revoked;
    address issuer;
    bytes32 documentHash;
  }

  // acknowledgement state
  mapping(uint256 => bool) public acknowledged;

  // tokenId => metadata
  mapping(uint256 => DocumentMeta) private _documentMeta;

  // documentHash => issued
  mapping(bytes32 => bool) public issuedDocuments;

  // tokenId => pending receiver
  mapping(uint256 => address) public pendingReceiver;

  // tokenId => reader => access
  mapping(uint256 => mapping(address => bool)) private _readAccess;

  // tokenId => reader => expiry
  mapping(uint256 => mapping(address => uint256)) private _readAccessExpiry;

  // tokenId => frozen
  mapping(uint256 => bool) public frozenURI;

  /* ============================================================
                                EVENTS
       ============================================================ */

  event DocumentIssued(
    uint256 indexed tokenId,
    address indexed owner,
    address indexed issuer,
    bytes32 documentHash
  );
  event DocumentAcknowledged(
    uint256 indexed tokenId,
    address indexed owner,
    uint256 acknowledgedAt
  );
  event DocumentRevoked(uint256 indexed tokenId, address indexed issuer);
  event TransferRequested(uint256 indexed tokenId, address indexed from, address indexed to);
  event TransferAccepted(uint256 indexed tokenId, address indexed from, address indexed to);
  event ReadAccessGranted(uint256 indexed tokenId, address indexed user, uint256 expiresAt);
  event ReadAccessRevoked(uint256 indexed tokenId, address indexed user);
  event IssuerAdded(address indexed issuer);
  event IssuerRemoved(address indexed issuer);

  /* ============================================================
                              CONSTRUCTOR
       ============================================================ */

  constructor() ERC721('Enterprise Document Registry', 'EDOC') {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ISSUER_ROLE, msg.sender);
  }

  /* ============================================================
                          ISSUER MANAGEMENT
       ============================================================ */

  function addIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _grantRole(ISSUER_ROLE, issuer);
    emit IssuerAdded(issuer);
  }

  function removeIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _revokeRole(ISSUER_ROLE, issuer);
    emit IssuerRemoved(issuer);
  }

  /* ============================================================
                            DOCUMENT ISSUANCE
       ============================================================ */

  function issueDocument(
    address to,
    string calldata uri,
    uint256 expiresAt,
    bytes32 documentHash
  ) external onlyRole(ISSUER_ROLE) returns (uint256) {
    require(to != address(0), 'Invalid recipient');
    require(bytes(uri).length > 0, 'Empty URI');
    require(!issuedDocuments[documentHash], 'Document already issued');

    _tokenIdCounter++;
    uint256 tokenId = _tokenIdCounter;

    issuedDocuments[documentHash] = true;

    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);

    _documentMeta[tokenId] = DocumentMeta({
      issuedAt: block.timestamp,
      expiresAt: expiresAt,
      revoked: false,
      issuer: msg.sender,
      documentHash: documentHash
    });

    frozenURI[tokenId] = true;

    emit DocumentIssued(tokenId, to, msg.sender, documentHash);
    return tokenId;
  }

  /* ============================================================
                     TRANSFER WITH ACCEPTANCE
       ============================================================ */

  function requestTransfer(uint256 tokenId, address to) external {
    require(_ownerOf(tokenId) != address(0), 'Invalid tokenId');
    require(ownerOf(tokenId) == msg.sender, 'Not owner');
    require(!_documentMeta[tokenId].revoked, 'Revoked');
    require(to != address(0), 'Invalid receiver');
    require(pendingReceiver[tokenId] == address(0), 'Transfer already pending');

    pendingReceiver[tokenId] = to;
    emit TransferRequested(tokenId, msg.sender, to);
  }

  function acceptTransfer(uint256 tokenId) external {
    require(pendingReceiver[tokenId] == msg.sender, 'Not authorized');
    require(!_documentMeta[tokenId].revoked, 'Revoked');

    address from = ownerOf(tokenId);

    _transfer(from, msg.sender, tokenId);
    pendingReceiver[tokenId] = address(0);

    emit TransferAccepted(tokenId, from, msg.sender);
  }

  function acknowledgeDocument(uint256 tokenId) external {
    require(ownerOf(tokenId) == msg.sender, 'Not document owner');
    require(!_documentMeta[tokenId].revoked, 'Revoked');
    require(!acknowledged[tokenId], 'Already acknowledged');

    acknowledged[tokenId] = true;

    emit DocumentAcknowledged(tokenId, msg.sender, block.timestamp);
  }

  /* ============================================================
                    OZ v5 TRANSFER ENFORCEMENT
       ============================================================ */

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override returns (address from) {
    from = super._update(to, tokenId, auth);

    // Allow minting
    if (from == address(0)) return from;

    require(!_documentMeta[tokenId].revoked, 'Document revoked');
    require(pendingReceiver[tokenId] == to, 'Transfer not accepted');

    return from;
  }

  /* ============================================================
                            READ ACCESS
       ============================================================ */

  function grantReadAccess(uint256 tokenId, address user, uint256 expiresAt) external {
    require(ownerOf(tokenId) == msg.sender, 'Not owner');
    require(!_documentMeta[tokenId].revoked, 'Revoked');

    _readAccess[tokenId][user] = true;
    _readAccessExpiry[tokenId][user] = expiresAt;

    emit ReadAccessGranted(tokenId, user, expiresAt);
  }

  function revokeReadAccess(uint256 tokenId, address user) external {
    require(ownerOf(tokenId) == msg.sender, 'Not owner');

    delete _readAccess[tokenId][user];
    delete _readAccessExpiry[tokenId][user];

    emit ReadAccessRevoked(tokenId, user);
  }

  function hasReadAccess(uint256 tokenId, address user) public view returns (bool) {
    if (_ownerOf(tokenId) == address(0)) return false;
    if (_documentMeta[tokenId].revoked) return false;

    if (ownerOf(tokenId) == user) return true;
    if (!_readAccess[tokenId][user]) return false;

    uint256 expiry = _readAccessExpiry[tokenId][user];
    return expiry == 0 || block.timestamp <= expiry;
  }

  /* ============================================================
                            REVOCATION
       ============================================================ */

  function revokeDocument(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
    require(_ownerOf(tokenId) != address(0), 'Invalid tokenId');
    require(!_documentMeta[tokenId].revoked, 'Already revoked');

    // Only original issuer OR admin can revoke
    require(
      _documentMeta[tokenId].issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
      'Not document issuer'
    );

    _documentMeta[tokenId].revoked = true;
    emit DocumentRevoked(tokenId, msg.sender);
  }

  /* ============================================================
                            VALIDITY
       ============================================================ */

  function isValid(uint256 tokenId) external view returns (bool) {
    if (_ownerOf(tokenId) == address(0)) return false;

    DocumentMeta memory meta = _documentMeta[tokenId];
    if (meta.revoked) return false;
    if (meta.expiresAt != 0 && block.timestamp > meta.expiresAt) return false;
    return true;
  }

  function getDocumentMeta(uint256 tokenId) external view returns (DocumentMeta memory) {
    require(_ownerOf(tokenId) != address(0), 'Invalid tokenId');
    return _documentMeta[tokenId];
  }

  /* ============================================================
                         METADATA IMMUTABILITY
       ============================================================ */

  function _setTokenURI(uint256 tokenId, string memory uri) internal override {
    require(!frozenURI[tokenId], 'Metadata frozen');
    super._setTokenURI(tokenId, uri);
  }

  /* ============================================================
                       INTERFACE SUPPORT
       ============================================================ */

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721URIStorage, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
