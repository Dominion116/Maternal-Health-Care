# MamaGuide: Maternal Health Education Chatbot

A comprehensive AI-powered chatbot application designed to provide maternal health education, support, and emergency awareness to pregnant women in resource-limited settings. Built with a React frontend and Express.js backend, featuring an in-house neural-network intent classifier that drives conversational responses grounded in a validated knowledge base, and an administrative dashboard for monitoring and analytics.

## Overview

MamaGuide combines natural language processing and machine learning to deliver personalized maternal health guidance. The system classifies user messages by intent, grounds responses in evidence-based WHO and FMOH guidelines, and tracks emergency indicators to support clinical decision-making.

### Key Features

- **AI-Powered Chat Interface**: Neural-network intent classification with responses drawn from an evidence-based knowledge base
- **Pregnancy Profile Management**: Users can track pregnancy stage, due date, and health information
- **Emergency Detection**: Automated flagging of urgent maternal health conditions
- **Chat History and Saving**: Users can save and revisit conversations
- **Admin Dashboard**: Analytics, user management, feedback review, SUS scoring, and model performance metrics
- **Research Consent System**: Structured data collection with proper consent workflows
- **Educational Content Library**: Comprehensive articles organized by medical category
- **User Role Management**: Support for pregnant women, nurses, researchers, admins, and super-admins

## Project Structure

```
Maternal Health Care/
├── backend/                      # Express.js server
│   ├── src/
│   │   ├── modules/             # Feature modules (auth, chat, admin, etc.)
│   │   ├── services/            # Business logic (chat, model prediction)
│   │   ├── ml/                  # Machine learning pipeline
│   │   │   ├── intents.json    # Intent definitions and training patterns
│   │   │   ├── model.ts        # TensorFlow.js model architecture
│   │   │   ├── classifier.ts   # Intent classification inference
│   │   │   └── artifacts/      # Trained models and metrics
│   │   ├── content/            # Educational articles by medical category
│   │   ├── middlewares/        # Express middleware (auth, admin gates)
│   │   ├── config/             # Configuration and environment setup
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Helper utilities
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Server entry point
│   ├── supabase/
│   │   ├── migrations/         # Database migration scripts
│   │   └── schema.sql          # Complete database schema
│   ├── scripts/
│   │   └── create-admin.ts     # CLI tool for creating admin users
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API client services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Zustand state management
│   │   ├── routes/             # Route definitions and protection
│   │   ├── utils/              # Utilities and constants
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── documentation files          # Proposal, chapters, and implementation tracking
```

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens with Supabase Auth
- **ML**: TensorFlow.js (CPU backend), Universal Sentence Encoder base model (transfer learning)
- **Documentation**: Swagger/OpenAPI with swagger-ui-express
- **Validation**: Zod for runtime type checking
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **UI Components**: lucide-react (icons), react-hot-toast (notifications)

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- A Supabase project (PostgreSQL database)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Configure environment variables. Create or update `.env`:
```bash
# Supabase credentials
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development
```

3. Set up the database:
   - Connect to your Supabase project
   - Run the migrations in `backend/supabase/migrations/` in order (002, 003)
   - Alternatively, execute `backend/supabase/schema.sql` for a fresh install

4. Create a super admin user:
```bash
npm run create-admin -- admin@example.com
```

5. Train the ML model:
```bash
npm run train-model
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000` with Swagger documentation at `/api-docs`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Development

### Backend Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled production build
npm run lint         # Check code style with ESLint
npm run lint:fix     # Fix linting issues automatically
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run train-model  # Train the intent classification model
npm run create-admin -- <email> [role] # Create admin or super-admin user
```

### Frontend Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Check code style with ESLint
npm run preview  # Preview production build locally
```

## API Documentation

The backend provides a REST API documented with Swagger/OpenAPI. After starting the server, visit:
```
http://localhost:3000/api-docs
```

### Main Endpoints

- **Authentication**: `/auth/register`, `/auth/login`, `/auth/reset-password`, `/auth/accept-invite`
- **Chat**: `/chat/send-message`, `/history/*`
- **Admin**: `/admin/users`, `/admin/invite`, `/admin/conversations`, `/admin/analytics`
- **Feedback**: `/evaluation/feedback`, `/evaluation/consent`
- **Education**: `/education/categories`, `/education/articles`
- **Health**: `/health`

## Machine Learning Pipeline

The intent classification system uses **transfer learning** with TensorFlow.js:

### Architecture
- **Base model (frozen, pretrained)**: Google's Universal Sentence Encoder — converts each
  message into a 512-dimensional semantic sentence embedding. Its weights are never updated;
  they are downloaded from TF-Hub on first load.
- **Classification head (trained)**: Dense(128, relu) + Dropout(0.5), Dense(64, relu) +
  Dropout(0.5), Softmax output over the intent classes.

### Training (`npm run train-model` in `backend/`)
- Dataset: `backend/src/ml/intents.json` (patterns + validated responses per intent)
- Every pattern is embedded once by the base model; only the head is trained on the embeddings
- Split: 80% training, 20% held-out test (stratified per intent)
- Epochs: 200, Adam optimizer, categorical cross-entropy

### Artifacts (`backend/src/ml/artifacts/`)
- Head weights: `weights.json`
- Model config (base model name + embedding dims): `model-config.json`
- Class definitions: `classes.json`
- Metrics: `metrics.json` (accuracy, precision, recall, F1, confusion matrix on the test split)

### Intent Grounding
Each classified intent is grounded in the knowledge base (`intents.json`), mapping to evidence-based guidance from:
- World Health Organization (WHO) maternal health guidelines
- Federal Ministry of Health (FMOH) protocols
- Clinical evidence and best practices

## User Roles and Permissions

- **Pregnant Woman**: Default user role; access to chat, history, feedback
- **Nurse**: Healthcare provider role; access to chat and user support features
- **Researcher**: Research access role; view aggregated analytics and conversation data
- **Admin**: Administrative role; user management, moderate conversations, review feedback
- **Super Admin**: Highest privilege; invite new admins, manage admin accounts

## Database Schema

The Supabase PostgreSQL database includes tables for:
- `auth.users`: Supabase authentication user records
- `user_profiles`: User metadata, role, onboarding status
- `conversations`: Chat session records with save status
- `messages`: Individual chat messages with intent classification and emergency flags
- `feedback_submissions`: User feedback and ratings
- `research_consent_records`: Consent workflow tracking
- `education_articles`: Educational content
- `admin_action_logs`: Audit trail of administrative actions

See `backend/supabase/schema.sql` for the complete schema.

## Deployment

### Backend Deployment (Example: Node.js hosting)

1. Build the project:
```bash
npm run build
```

2. Set production environment variables on your hosting platform

3. Start the application:
```bash
npm start
```

### Frontend Deployment (Example: Vercel, Netlify)

1. Build for production:
```bash
npm run build
```

2. Deploy the `dist/` directory to your hosting platform

## Testing

### Backend Tests

```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

## Known Limitations

- Intent classification uses a small dataset (182 patterns) and exhibits overfitting. Test accuracy is approximately 58%, indicating room for expansion with more training examples.
- The system requires a live Supabase project to function; local development with placeholder credentials will not work for database-dependent features.
- Emergency detection is intent-based and should not replace professional medical judgment or direct emergency services contact.
- Currently English-language only; multilingual support requires additional prompt engineering.

## Environment Checklist

Before running the application, ensure:

- [ ] Supabase project is created and credentials are in `.env`
- [ ] Database migrations have been applied to your Supabase project
- [ ] At least one super-admin user has been created via `npm run create-admin`
- [ ] The intent-classification model has been trained via `npm run train-model`
- [ ] Frontend can reach the backend API (CORS configured if needed)

## Troubleshooting

### Backend won't start
- Verify Node.js version is 18 or later
- Ensure all dependencies installed: `npm install`
- Check that `.env` file exists and contains required variables
- Run `npx tsc --noEmit` to check for TypeScript errors

### Database connection fails
- Confirm Supabase credentials in `.env` are correct
- Check that migrations have been applied to your Supabase project
- Verify network connectivity to `*.supabase.co`

### Frontend can't connect to backend
- Ensure backend is running on the expected port (default 3000)
- Check browser console for CORS errors
- Verify API URL in frontend environment configuration

### Chat responses are generic
- Confirm the model has been trained: run `npm run train-model` in `backend/`
- Low-confidence classifications return a clarification prompt — check the `intent_confidence` values logged with each message
- Check backend logs for any errors

## Contributing

When making changes:
1. Follow the existing code style and structure
2. Run linting before committing: `npm run lint:fix`
3. Ensure TypeScript compilation succeeds: `npx tsc --noEmit`
4. Run tests: `npm run test`
5. Update documentation if adding new features

## References

- [Supabase Documentation](https://supabase.com/docs)
- [TensorFlow.js Documentation](https://js.tensorflow.org/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

This project is part of a research initiative on maternal health education in resource-limited settings.

## Support

For issues, questions, or feedback, please refer to the IMPLEMENTATION_PROGRESS.md file for detailed setup notes and current status.
