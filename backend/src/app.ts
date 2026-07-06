import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import chatRoutes from './modules/chat/chat.routes';
import historyRoutes from './modules/history/history.routes';
import profileRoutes from './modules/profile/profile.routes';
import adminRoutes from './modules/admin/admin.routes';
import evaluationRoutes from './modules/evaluation/evaluation.routes';
import educationRoutes from './modules/education/education.routes';
import onboardingRoutes from './modules/onboarding/onboarding.routes';
import contactRoutes from './modules/contact/contact.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// swagger-ui-express serves its assets from node_modules/swagger-ui-dist via
// express.static, which Vercel's serverless bundler doesn't package — every
// asset request 404s and falls through to the same HTML shell. Load the
// Swagger UI page from a CDN instead and only serve the raw spec ourselves.
app.use(
  '/api-docs',
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
        imgSrc: ["'self'", 'data:', 'https://unpkg.com'],
      },
    },
  })
);

app.get('/api-docs/swagger.json', (_req, res) => res.json(swaggerSpec));

app.get('/api-docs', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MamaGuide API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`);
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

export default app;
