import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
