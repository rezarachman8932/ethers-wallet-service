const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Knowledge Catalyst Wallet Service API',
      version: '1.0.0',
      description: 'API documentation for Knowledge Catalyst Wallet Service API management system',
      contact: {
        name: 'Knowledge Catalyst',
        email: 'support@knowledgecatalyst.com',
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Enter JWT token',
        },
        AccessKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-wallet-access-key',
          description: 'Enter platform specific access key',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            response: {
              type: 'integer',
              description: 'Response status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              description: 'Response data',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            response: {
              type: 'integer',
              description: 'Response status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              description: 'Response data',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            response: {
              type: 'integer',
              description: 'Response status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              properties: {
                docs: {
                  type: 'array',
                  description: 'Array of documents',
                },
                pagination: {
                  type: 'object',
                  description: 'Pagination details',
                  properties: {
                    currentPage: {
                      type: 'integer',
                      description: 'Current page number',
                      example: 1,
                    },
                    pageSize: {
                      type: 'integer',
                      description: 'Data per page',
                      example: 50,
                    },
                    totalData: {
                      type: 'integer',
                      description: 'Total number of records',
                      example: 50,
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'Total number of pages',
                      example: 5,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
        AccessKeyAuth: [],
      },
    ],
  },
  apis: ['./docs/*/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
