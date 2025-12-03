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
