import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API Documentation',
    version: '1.0.0',
    description: 'API documentation for the E-Commerce platform',
  },
  servers: [{ url: 'http://localhost:5000', description: 'Local server' }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);


router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
