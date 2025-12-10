/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management endpoints
 */

/**
 * @swagger
 * /api/v1/wallet:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     description: This endpoint create a new wallet address
 *     security:
 *      - AccessKeyAuth: []
 *      - BearerAuth: []
 *     parameters:
 *      - in: header
 *        name: "x-wallet-access-key"
 *        description: "Enter platform specific access key"
 *      - in: header
 *        name: "x-signature-key"
 *        description: "Signature Key"
 *     responses:
 *       '201':
 *         description: Platform created successfully. Returns access key and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/private:
 *   post:
 *     summary: Create a new wallet using private key
 *     tags: [Wallet]
 *     description: This endpoint create wallet address using private key
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - privateKey
 *              properties:
 *                privateKey:
 *                  type: string
 *                  description: wallet address private key
 *                  example: "0x24c76ad3d8b9131b....."
 *
 *     responses:
 *       '201':
 *         description: Platform created successfully. Returns access key and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/mnemonic:
 *   post:
 *     summary: Create a new wallet using mnemonic
 *     tags: [Wallet]
 *     description: This endpoint create wallet address using mnemonic
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - mnemonic
 *              properties:
 *                mnemonic:
 *                  type: string
 *                  description: wallet address mnemonic
 *                  example: "doctor veteran snap almost opinion dream obtain blood wood secret love magic"
 *
 *     responses:
 *       '201':
 *         description: Platform created successfully. Returns access key and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/balance:
 *   post:
 *     summary: get balance
 *     tags: [Wallet]
 *     description: This endpoint get balance wallet address
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - address
 *                - network
 *              properties:
 *                address:
 *                  type: string
 *                  description: wallet address
 *                  example: "0x839843..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "amoy or sepolia or polygon or mainnet"
 *
 *     responses:
 *       '201':
 *         description: Platform created successfully. Returns access key and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/convert:
 *   post:
 *     summary: Convert fiat to Crypto
 *     tags: [Wallet]
 *     description: This endpoint Convert fiat to Crypto
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - fiatCurrency
 *                - cryptoSymbol
 *                - amount
 *              properties:
 *                fiatCurrency:
 *                  type: string
 *                  description: Indonesia Rupiah (IDR), Singapore Dollar (SGD)
 *                  example: "IDR or SGD"
 *                cryptoSymbol:
 *                  type: string
 *                  description: Crypto Coin Symbol
 *                  example: "POL or ETH"
 *                amount:
 *                  type: integer
 *                  description: amount
 *                  example: 50000
 *
 *     responses:
 *       '201':
 *         description: Platform created successfully. Returns access key and token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/transaction/history:
 *   post:
 *     summary: Get History Transaction
 *     tags: [Wallet]
 *     description: This endpoint Get History Transaction
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - address
 *                - network
 *              properties:
 *                address:
 *                  type: string
 *                  description: wallet address
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *
 *     responses:
 *       '200':
 *         description: Transaction history fetched successfully!.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing address or network in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to fetch transaction history!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/transaction/detail:
 *   post:
 *     summary: Get detail Transaction
 *     tags: [Wallet]
 *     description: This endpoint Get detail Transaction
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - txHash
 *                - network
 *              properties:
 *                txHash:
 *                  type: string
 *                  description: wallet txHash
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *
 *     responses:
 *       '200':
 *         description: Transaction history fetched successfully!.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing address or network in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to fetch transaction history!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/estimate:
 *   post:
 *     summary: Get gas estimation
 *     tags: [Wallet]
 *     description: This endpoint for getting gas estimation
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - privateKey
 *                - network
 *                - contractAddress
 *                - abi
 *                - method
 *                - params
 *              properties:
 *                privateKey:
 *                  type: string
 *                  description: private key of wallet
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *                contractAddress:
 *                  type: string
 *                  description: contract address
 *                  example: "0x893849..."
 *                abi:
 *                  type: array
 *                  description: contract abi
 *                  example: []
 *                method:
 *                  type: string
 *                  description: contract method to be called
 *                  example: "transfer"
 *                params:
 *                  type: array
 *                  description: parameters for the contract method
 *                  example: ["0xabc123...", 1000]
 *
 *     responses:
 *       '200':
 *         description: Estimation cost  fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing required fields (network, contractAddress, abi, method, from)!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to get the estimation cost!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/transfer:
 *   post:
 *     summary: Transfer balance
 *     tags: [Wallet]
 *     description: This endpoint for transferring balance from one wallet to another
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - network
 *                - to
 *                - amount
 *                - privateKey
 *              properties:
 *                to:
 *                  type: string
 *                  description: recipient wallet address
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *                amount:
 *                  type: string
 *                  description: amount to be transferred
 *                  example: "0.01"
 *                privateKey:
 *                  type: string
 *                  description: sender wallet private key
 *                  example: "0x893849..."
 *
 *     responses:
 *       '200':
 *         description: Balance transferred successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing required fields!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Transfer balance failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/estimate/gas:
 *   post:
 *     summary: Get gas estimation for contract method
 *     tags: [Wallet]
 *     description: This endpoint for getting gas estimation for contract method
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - network
 *                - to
 *                - amount
 *                - privateKey
 *              properties:
 *                to:
 *                  type: string
 *                  description: recipient wallet address
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *                amount:
 *                  type: string
 *                  description: amount to be transferred
 *                  example: "0.01"
 *                privateKey:
 *                  type: string
 *                  description: sender wallet private key
 *                  example: "0x893849..."
 *
 *     responses:
 *       '200':
 *         description: Estimation cost for transfer balance fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing required fields!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Estimation cost for transfer balance failed to get!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/nonce:
 *   post:
 *     summary: Get nonce for wallet address
 *     tags: [Wallet]
 *     description: This endpoint for getting nonce for wallet address
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - address
 *                - network
 *              properties:
 *                address:
 *                  type: string
 *                  description: wallet address
 *                  example: "0x893849..."
 *                network:
 *                  type: string
 *                  description: blockchain network
 *                  example: "ethereum or polygon"
 *
 *     responses:
 *       '200':
 *         description: Nonce fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Missing address or network in the request body!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to fetch nonce!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/gas-price:
 *   get:
 *     summary: Get gas price
 *     tags: [Wallet]
 *     description: This endpoint for getting gas price
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *          type: string
 *         description: Blockchain network
 *
 *     responses:
 *       '200':
 *         description: Gas price fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Query param network is required!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to get gas price!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/block/latest:
 *   get:
 *     summary: Get latest block
 *     tags: [Wallet]
 *     description: This endpoint for getting latest block
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *          type: string
 *         description: Blockchain network
 *
 *     responses:
 *       '200':
 *         description: Latest block fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Query parameter of 'network' is required!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Latest block failed to get!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/block/hash:
 *   get:
 *     summary: Get block by hash
 *     tags: [Wallet]
 *     description: This endpoint for getting block by hash
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *          type: string
 *         description: Blockchain network
 *       - in: query
 *         name: hash
 *         required: true
 *         schema:
 *          type: string
 *         description: Block hash
 *
 *     responses:
 *       '200':
 *         description: Block fetched by hash successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Query parameters of 'network' and 'hash' are required!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Block fetched by hash failed to get!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/block/number:
 *   get:
 *     summary: Get block by number
 *     tags: [Wallet]
 *     description: This endpoint for getting block by number
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *          type: string
 *         description: Blockchain network
 *       - in: query
 *         name: blockNumber
 *         required: true
 *         schema:
 *          type: string
 *         description: Block number
 *
 *     responses:
 *       '200':
 *         description: Block fetched by number successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Query parameters of 'network' and 'blockNumber' are required!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Block fetched by number failed to get!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/wallet/block/transactions:
 *   get:
 *     summary: Get block with full transactions
 *     tags: [Wallet]
 *     description: This endpoint for getting block with full transactions
 *     security:
 *       - AccessKeyAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: "x-wallet-access-key"
 *         description: "Enter platform specific access key"
 *       - in: header
 *         name: "x-signature-key"
 *         description: "Signature Key"
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *          type: string
 *         description: Blockchain network
 *       - in: query
 *         name: hash
 *         required: true
 *         schema:
 *          type: string
 *         description: Block hash
 *
 *     responses:
 *       '200':
 *         description: Block with full transactions fetched successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Query parameters of 'network' and 'hash' are required!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '422':
 *         description: Failed to fetch block with transactions!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
