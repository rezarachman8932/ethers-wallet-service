/**
 * @swagger
 * tags:
 *   name: Platform
 *   description: Platform management endpoints
 */

/**
 * @swagger
 * /api/v1/platform:
 *   post:
 *     summary: Create a new platform and get access credentials
 *     tags: [Platform]
 *     description: This endpoint registers a new platform and returns a unique `accessKey` and `token`. These credentials are required for authenticating subsequent API requests. The `token` should be used in the `Authorization Bearer <token>` header, and the `accessKey` in the `x-wallet-access-key` header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the platform.
 *                 example: My Awesome App
 *               description:
 *                 type: string
 *                 description: A brief description of the platform.
 *                 example: Academic platform for digital goods
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
 * /api/v1/platform:
 *  get:
 *    summary: get all platform data
 *    tags: [Platform]
 *    description: This endpoint for gat all records of platform
 *    security:
 *      - AccessKeyAuth: []
 *      - BearerAuth: []
 *    parameters:
 *      - in: header
 *        name: "x-wallet-access-key"
 *        description: "Enter platform specific access key"
 *      - in: header
 *        name: "x-signature-key"
 *        description: "Signature Key"
 *    responses:
 *      '200':
 *        description: Platform created successfully. Returns access key and token.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiResponse'
 *      '400':
 *        description: Bad Request - Invalid input data.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
