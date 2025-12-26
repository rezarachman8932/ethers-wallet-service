export const ABI = [
  // Functions
  "function issueDocument(address to, string uri, uint256 expiresAt, bytes32 documentHash) returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function acknowledgeDocument(uint256 tokenId)",
  "function getDocumentMeta(uint256 tokenId) view returns (tuple(uint256 issuedAt, uint256 expiresAt, bool revoked, address issuer, bytes32 documentHash))",
  "function acknowledged(uint256 tokenId) view returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function hasReadAccess(uint256 tokenId, address user) view returns (bool)",

  // Events
  "event DocumentIssued(uint256 indexed tokenId, address indexed owner, address indexed issuer, bytes32 documentHash)",
  "event DocumentAcknowledged(uint256 indexed tokenId, address indexed owner, uint256 acknowledgedAt)"
];