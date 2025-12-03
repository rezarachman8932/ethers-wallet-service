/**
 * @swagger
 * /generateSignatureKey:
 *    post:
 *      summary: Generate Signature Key
 *      tags: [Signature]
 *      description: Generate a signature based on accessKey, UUID, and the request payload.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - accessKey
 *                - uuid
 *                - reqBody
 *              properties:
 *                accessKey:
 *                  type: string
 *                  description: Your platform access key
 *                  example: "b0140ee27a2f98c32cc1967708eb13c387c6d0140d2e83082588ffcca2a94f3a"
 *                uuid:
 *                  type: string
 *                  description: Your platform UUID
 *                  example: "07d3eaf1-8248-4ddf-94b9-88aa7f91ff07"
 *                reqBody:
 *                  type: object
 *                  description: The raw JSON body content that needs to be signed
 *                  example:
 *                    fiatCurrency: "IDR"
 *                    cryptoSymbol: "POL"
 *                    amount: 50000
 *      responses:
 *        '200':
 *          description: Signature generated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  signature:
 *                    type: string
 *                    example: "AizaEyjhjsd..."
 */
