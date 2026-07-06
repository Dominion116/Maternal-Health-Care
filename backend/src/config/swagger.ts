import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

// glob (used internally by swagger-jsdoc) treats backslashes as escape characters,
// not path separators — on Windows, path.join's backslash output silently matches
// zero files. Force forward slashes so the pattern works on Windows and Linux alike.
const routesGlob = path
  .join(__dirname, '../modules/**/*.routes.{ts,js}')
  .split(path.sep)
  .join('/');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MamaGuide API',
      version: '1.0.0',
      description: 'Maternal Health Chatbot Backend API',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [routesGlob],
};

export const swaggerSpec = swaggerJsdoc(options);
