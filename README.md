# MamaGuide: Maternal Health Education Chatbot

A deep learning–based chatbot application that provides maternal health education, support, and emergency awareness for pregnant women in resource-limited settings. Built with a React frontend and Express.js backend, it uses transfer learning (Universal Sentence Encoder + trained neural classification head) to classify user intents and return responses grounded in a validated knowledge base, plus an administrative dashboard for monitoring and analytics.

## Overview

MamaGuide combines natural language processing and deep learning to deliver maternal health guidance. The system embeds each user message with a pretrained deep neural sentence encoder, classifies the intent with a trained Softmax head, grounds the reply in evidence-based WHO and FMOH-aligned content, and can flag emergency-related intents.

### Key Features

- **Deep Learning Chat Interface**: USE sentence embeddings + neural intent classification, with responses drawn from an evidence-based knowledge base
- **Pregnancy Profile Management**: Users can track pregnancy stage, due date, and health information
- **Emergency Detection**: Intent-based flagging of urgent maternal health conditions
- **Chat History and Saving**: Users can save and revisit conversations
- **Admin Dashboard**: Analytics, user management, feedback review, SUS scoring, and model performance metrics
- **Research Consent System**: Structured data collection with proper consent workflows
- **Educational Content Library**: Articles organized by medical category (in-code content modules)
- **User Role Management**: Support for pregnant women, nurses, researchers, admins, and super-admins

## Project Structure

```
Maternal Health Care/
├── backend/                         # Express.js + TypeScript server
│   ├── src/
│   │   ├── modules/                 # Feature modules (auth, chat, admin, etc.)
│   │   ├── services/                # Business logic (model prediction, emergency, recommendations)
│   │   ├── ml/                      # Deep learning / intent pipeline
│   │   │   ├── intents.json         # Intent definitions, patterns, validated responses
│   │   │   ├── embedder.ts          # Universal Sentence Encoder (frozen base model)
│   │   │   ├── model.ts             # FFN + logistic classification heads
│   │   │   ├── classifier.ts        # Live inference (USE → head → intent)
│   │   │   ├── train.ts             # Training script (npm run train-model)
│   │   │   ├── knowledgeBase.ts     # Intent → response lookup
│   │   │   ├── baselines.ts         # Baseline model comparison
│   │   │   ├── io.ts                # Artifact load/save helpers
│   │   │   └── artifacts/           # Trained weights, classes, centroids, metrics
│   │   ├── content/education/       # Educational articles by category
│   │   ├── middlewares/             # Auth, admin, validation, errors
│   │   ├── config/                  # Env, Supabase, Swagger
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── supabase/
│   │   ├── migrations/              # 001–004 SQL migrations
│   │   └── schema.sql               # Full schema (fresh install)
│   ├── scripts/
│   │   ├── create-admin.ts          # Promote existing user to admin/super_admin
│   │   └── copy-artifacts.js        # Copy ML artifacts into dist/ on build
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.ts
│
├── frontend/                        # React + Vite application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/                # API clients
│   │   ├── hooks/
│   │   ├── store/                   # Zustand
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js               # Port 3001, /api proxy, Tailwind v4 plugin
│   └── vercel.json
│
├── docs/                            # Diagrams and project documentation
└── README.md
```

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens with Supabase Auth
- **ML**: TensorFlow.js (WASM backend preferred, CPU fallback), Universal Sentence Encoder (transfer learning)
- **Documentation**: Swagger/OpenAPI (CDN-hosted Swagger UI + local OpenAPI spec)
- **Validation**: Zod
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` — no separate `tailwind.config.js`)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **UI**: lucide-react (icons), react-hot-toast (notifications)

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

2. Configure environment variables. Copy `.env.example` to `.env` and fill in values:
```bash
PORT=3000
NODE_ENV=development

# Supabase (full HTTPS URL required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT signing secret for API tokens
JWT_SECRET=your-jwt-secret

# Frontend origin (password-reset redirects, etc.)
FRONTEND_URL=http://localhost:3001
```

3. Set up the database:
   - Connect to your Supabase project
   - Prefer a fresh install: run `backend/supabase/schema.sql`
   - Or apply migrations in order: `001`, `002`, `003`, `004` under `backend/supabase/migrations/`

4. Register a normal user in the app (or Supabase Auth), then promote them to super admin:
```bash
# Email must already exist in Supabase Auth
npm run create-admin -- admin@example.com
# Optional role: admin | super_admin (default: super_admin)
npm run create-admin -- admin@example.com super_admin
```

5. Train the intent classification model (required before chat works):
```bash
npm run train-model
```

6. Start the development server:
```bash
npm run dev
```

The API is available at `http://localhost:3000`. Swagger UI: `http://localhost:3000/api-docs`. OpenAPI JSON: `/api-docs/swagger.json`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. (Optional) Set the API base URL. By default the Vite dev server proxies `/api` to `http://localhost:3000`, so no env file is required for local development.
```bash
# frontend/.env  (only if you need a non-default API base)
VITE_API_URL=/api
```

3. Start the development server:
```bash
npm run dev
```

The application is available at **`http://localhost:3001`** (not the Vite default 5173).

## Development

### Backend Commands

```bash
npm run dev           # Start server with hot reload (tsx watch)
npm run build         # train-model + tsc + copy ML artifacts to dist/
npm run start         # Run compiled production build (node dist/index.js)
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run test          # Jest (runInBand)
npm run test:watch    # Jest watch mode
npm run test:coverage # Jest coverage
npm run train-model   # Train intent heads and write artifacts
npm run create-admin -- <email> [admin|super_admin]
```

### Frontend Commands

```bash
npm run dev      # Vite dev server on port 3001
npm run build    # Production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## API Documentation

After starting the backend, open:
```
http://localhost:3000/api-docs
```

All REST routes are mounted under the **`/api`** prefix (except `/health` and `/api-docs`).

### Main Endpoints

- **Authentication** (`/api/auth`): `register`, `login`, `forgot-password`, `reset-password`, `verify-otp`, `resend-otp`, `accept-invite`, `logout`
- **Chat** (`/api/chat`): `POST /sessions`, `POST /message`, `GET /recommendations`
- **History** (`/api/history`): conversations, messages, save/delete
- **Profile** (`/api/profile`): get/update profile, export data, delete account
- **Onboarding** (`/api/onboarding`): complete onboarding
- **Education** (`/api/education`): categories, search, articles by category/slug
- **Evaluation** (`/api/evaluation`): research consent, SUS questionnaire, feedback
- **Contact** (`/api/contact`): contact form submission
- **Admin** (`/api/admin`): users, invite, conversations, analytics, SUS, feedback, model-metrics
- **Health**: `GET /health`

## Machine Learning Pipeline

The intent system uses **transfer learning** with TensorFlow.js:

```
User message
  → Universal Sentence Encoder (frozen deep encoder) → 512-dim embedding
  → Trained Softmax classification head → intent + confidence
  → Confidence / centroid similarity gates
  → Knowledge base (intents.json) → validated response
```

### Architecture

- **Base model (frozen, pretrained)**: Google’s **Universal Sentence Encoder** — maps each message to a **512-dimensional** semantic embedding. Weights are never fine-tuned; they load from TF-Hub on first use.
- **Runtime backend**: TensorFlow.js **WASM** when available (~much faster embedding), otherwise **CPU**.
- **Classification heads** (both trained during `npm run train-model`):
  - **Multi-layer FFN** (evaluated for the project):  
    `Dense(128, ReLU) → Dropout(0.2) → Dense(64, ReLU) → Dropout(0.2) → Dense(N, Softmax)`
  - **Logistic / linear Softmax head** (used for **live** inference in `classifier.ts`):  
    `Dense(N, Softmax)` on the USE embedding — selected after empirical comparison on this dataset.
- **Safety gates**: Softmax confidence threshold and cosine similarity to the predicted intent’s training centroid (out-of-domain → `unknown` + safe fallback).

### Training (`npm run train-model` in `backend/`)

- **Dataset**: `backend/src/ml/intents.json` (patterns + validated responses per intent; hundreds of intents / thousands of patterns)
- Every pattern is embedded once by the frozen base model; only the head(s) are trained on embeddings
- **Split**: stratified ~80% train / 20% held-out test per intent
- **Epochs**: 200, **Adam**, **categorical cross-entropy**
- Baselines and FFN metrics are written for evaluation/reporting

### Artifacts (`backend/src/ml/artifacts/`)

After a successful train, expect files such as:

| File | Purpose |
|------|---------|
| `model-config.json` | Base model name + embedding dimension |
| `classes.json` | Ordered intent class labels |
| `weights.json` | Multi-layer FFN head weights |
| `logistic-weights.json` | Live logistic Softmax head weights |
| `centroids.json` | Per-intent training centroids (OOD gate) |
| `metrics.json` | Accuracy / precision / recall / F1 / curves / comparisons |

The live server requires at least the config, classes, **logistic** weights, and centroids (plus network access once to load USE).

### Intent Grounding

Each classified intent maps to curated responses in `intents.json`, aligned with guidance such as:

- World Health Organization (WHO) maternal health guidelines
- Federal Ministry of Health (FMOH) protocols
- Clinical evidence and best practices

Educational **articles** for the library live under `backend/src/content/education/` (TypeScript modules by category), not as a separate `education_articles` SQL table.

## User Roles and Permissions

- **Pregnant Woman**: Default user role; chat, history, education, feedback
- **Nurse**: Healthcare provider role; chat and support-oriented access
- **Researcher**: Research-oriented access; evaluation and analytics contexts
- **Admin**: User management, conversations, feedback, analytics
- **Super Admin**: Invite admins, highest administrative privileges

Self-registration is limited to non-admin roles. The first super admin must be promoted with `npm run create-admin` after the account exists in Supabase Auth.

## Database Schema

The Supabase PostgreSQL database includes tables such as:

- `auth.users` — Supabase authentication records
- `user_profiles` — Role, onboarding, pregnancy/profile metadata, settings
- `conversations` — Chat sessions (including save status / session tracking)
- `messages` — Individual messages (intent, confidence, emergency flags as applicable)
- `research_consent` — Research consent records
- `sus_responses` — System Usability Scale submissions
- `feedback` — User feedback
- `contact_submissions` — Contact form entries

See `backend/supabase/schema.sql` and `backend/supabase/migrations/` for the authoritative definitions.

## Deployment

### Backend

1. Set production environment variables (same keys as `.env.example`).
2. Build (trains model, compiles TypeScript, copies artifacts):
```bash
cd backend
npm run build
```
3. Start:
```bash
npm start
```

Ensure the host can download the USE model from TF-Hub on first boot (or that the runtime can reach the cached weights path you configure).

### Frontend

1. Build:
```bash
cd frontend
npm run build
```
2. Deploy the `dist/` directory (e.g. Vercel — see `frontend/vercel.json`).
3. Point `VITE_API_URL` at your production API if the frontend is not proxying `/api` to the same origin.

## Testing

### Backend

```bash
cd backend
npm run test
npm run test:watch
npm run test:coverage
```

## Known Limitations

- **Classification, not free-form generation**: Replies are retrieved from a validated knowledge base after intent classification. This improves safety and grounding but means the bot cannot invent arbitrary answers outside known intents.
- **Out-of-domain handling**: Low Softmax confidence or low similarity to intent centroids yields a clarification / fallback response rather than a forced answer.
- **Dataset & metrics change when you retrain**: Intent/pattern counts and accuracy figures live in `intents.json` and the latest `metrics.json` after `npm run train-model`. Do not rely on outdated notebook-era numbers (e.g. small pattern counts from early prototypes).
- **Supabase required**: Database and auth features need a live Supabase project with migrations/schema applied.
- **Emergency support is assistive only**: Intent-based emergency flags must not replace professional care or emergency services.
- **Language**: Content and training patterns are primarily English; other languages need expanded patterns and responses in the knowledge base.
- **Live head vs FFN**: The multi-layer FFN is trained and evaluated; the production path currently uses the logistic Softmax head on USE embeddings because it performed better on this many-class dataset. Both are part of the deep learning / transfer-learning design.

## Environment Checklist

Before running the full application:

- [ ] Supabase project created; credentials in `backend/.env`
- [ ] `schema.sql` or migrations **001–004** applied
- [ ] At least one user registered, then promoted via `npm run create-admin`
- [ ] Intent model trained: `npm run train-model` (artifacts present under `src/ml/artifacts/`)
- [ ] Backend running on port **3000**
- [ ] Frontend running on port **3001** (proxy `/api` → backend)

## Troubleshooting

### Backend won't start
- Use Node.js 18+
- Run `npm install` in `backend/`
- Confirm `.env` exists and passes validation (`SUPABASE_*`, `JWT_SECRET`, valid `SUPABASE_URL` / `FRONTEND_URL`)
- Check TypeScript: `npx tsc --noEmit`

### Database connection fails
- Verify Supabase URL and keys
- Confirm schema/migrations applied
- Check network access to `*.supabase.co`

### Frontend can't reach the API
- Backend must be on port 3000; frontend on 3001
- In dev, use relative `/api` (Vite proxy) unless you set `VITE_API_URL` to an absolute API URL
- Check browser console for CORS or HTML-instead-of-JSON responses (usually wrong port/proxy)

### Chat responses are generic / fallback only
- Run `npm run train-model` and restart the server
- Confirm `logistic-weights.json`, `classes.json`, `model-config.json`, and `centroids.json` exist under `backend/src/ml/artifacts/`
- Low confidence or OOD messages intentionally return a clarification prompt
- Check backend logs for classifier / USE load errors (first USE download needs network)

### `create-admin` fails
- The email must already exist in Supabase Auth (register in the app first)
- Use service role key in `.env` so the admin list API works

## Contributing

When making changes:
1. Follow existing structure and style
2. Lint backend: `npm run lint:fix` (from `backend/`)
3. Typecheck: `npx tsc --noEmit`
4. Tests: `npm run test`
5. Update this README if behaviour, env vars, or architecture change

## References

- [Supabase Documentation](https://supabase.com/docs)
- [TensorFlow.js Documentation](https://js.tensorflow.org/)
- [Universal Sentence Encoder (TF Hub / TF.js)](https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

This project is part of a research / final-year initiative on maternal health education in resource-limited settings.

## Support

For setup questions, start with this README, `backend/.env.example`, and Swagger at `/api-docs`. Architecture diagrams (intent pipeline and system overview) are under `docs/diagrams/` when present in your working copy.
