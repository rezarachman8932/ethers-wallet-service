/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint to check if the service is running
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: Service is running and returns a welcome message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service Running!
 */

/**
 * @swagger
 * /check-health:
 *   get:
 *     summary: Check application and database connection health
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: The application is healthy and the database connection is successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check Health successfully!
 *       500:
 *         description: The application is unhealthy or failed to connect to the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check Health Failed!
 */
