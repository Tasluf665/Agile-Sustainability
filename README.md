# Agile Sustainability — GreenStory

An AI-powered sustainability support tool for Agile Requirements Engineering. GreenStory improves vague user stories through a quality-first, INVEST-based pipeline, adds sustainability-focused acceptance criteria, and tracks sustainability-related developer effort using story points and a team dashboard—helping teams translate organisational sustainability goals into actionable Agile work.

---

## Key Features

- **Invest-based refinement pipeline:** Automatically analyzes and improves user stories using INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- **Sustainability-aware acceptance criteria:** Appends sustainability-specific acceptance criteria and guidance to user stories so teams can consider environmental impact when implementing features.
- **Story points & effort tracking:** Tracks sustainability-related developer effort via story points and aggregates metrics on a team dashboard.
- **AI assistance:** Uses an AI backend to suggest refinements, create acceptance criteria, and generate sustainability suggestions based on organizational goals.
- **Role-based access & projects:** Multi-project support with roles, members, and per-project sustainability configurations.

## Screenshots

Dashboard view:

![Dashboard](/images/DashboardPage.png)

Project and listing pages:

![Project List](/images/ProjectPage.png)
![Project Details](/images/ProjectDetailsPage.png)

Use case and user story flows:

![Use Case Details](/images/UseCaseDetailsPage.png)
![User Story Details](/images/UserStoryDetailsPage.png)

Create / New item flows:

![New Use Case](/images/NewUseCasePage.png)
![New User Story Step 1](/images/NewUserStoryStep1Page.png)
![New User Story Step 2](/images/NewUserStoryStep2Page.png)
![New User Story Step 3](/images/NewUserStoryStep3Page.png)
![New User Story Step 4](/images/NewUserStoryStep4Page.png)

Authentication pages:

![Login](/images/LoginPage.png)

---

## How it works (overview)

1. A product owner or team member enters a rough user story into the system.
2. The AI pipeline evaluates the story against INVEST heuristics and returns a refined, higher-quality version.
3. Sustainability-focused acceptance criteria and suggestions are appended (for example, energy, emissions, materials, or process changes).
4. The team estimates story points for the sustainability work and assigns it to a sprint or backlog.
5. The dashboard aggregates story-point-based sustainability effort across projects and teams, helping translate organizational sustainability targets into actionable work.

## Architecture & Tech stack

- Frontend: Vite + React (files under `frontend/src`).
- Backend: Node.js + Express (files under `backend/src`).
- Database: MongoDB (default: `greenstory` database).
- AI: Requests are proxyed via the backend to an OpenRouter-compatible API (configured via environment variables).
- Email: SMTP-based transactional email for invites and notifications.

## API (quick reference)

The backend exposes REST endpoints (see `backend/src/routes`). Notable route groups:

- `POST /api/auth` — authentication, signup, login, password flows.
- `GET/POST /api/projects` — project CRUD and membership management.
- `GET/POST /api/use-cases` — manage use cases.
- `GET/POST /api/user-stories` — manage user stories and trigger AI refinement.
- `POST /api/ai/*` — AI endpoints used to refine stories and generate acceptance criteria.

For full details, inspect the routes in [backend/src/routes](backend/src/routes).

## Environment variables

Create a `.env` file in `backend/` (or provide env variables via your deployment). Important variables:

- `PORT` — backend port (default `3000`).
- `NODE_ENV` — `development` or `production`.
- `MONGODB_URI` — MongoDB connection URI (default `mongodb://localhost:27017/greenstory`).
- `JWT_SECRET` / `JWT_EXPIRE` — JWT signing secret and expiry.
- `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRE` — refresh-token settings.
- `FRONTEND_URL` — frontend origin used in emails/redirects (default `http://localhost:5173`).
- `OPENROUTER_API_KEY` — API key for the OpenRouter-compatible AI backend.
- `OPENROUTER_MODEL` — model id to use with the AI provider.
- `EMAIL_USER` / `EMAIL_APP_PASSWORD` — SMTP credentials for sending email
- `FROM_NAME` — optional display name for sent emails.

## Getting started — Local development

Prerequisites:

- Node.js (16+ recommended)
- npm or yarn
- MongoDB running locally or accessible via `MONGODB_URI`

Run backend:

```bash
cd backend
npm install
npm run dev
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Or use Docker Compose to run both services together (if Docker is installed):

```bash
docker-compose up --build
```

## Tests

Backend tests exist under `backend/__tests__` and use the test runner configured in the backend `package.json`.

Run backend tests:

```bash
cd backend
npm test
```

Frontend tests are under `frontend/__tests__` and can be run with the frontend test command.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a feature branch.
2. Add tests for new functionality where appropriate.
3. Submit a pull request with a clear description of changes.

## Files of interest

- Back-end entry: [backend/app.js](backend/app.js)
- Front-end entry: [frontend/src/main.jsx](frontend/src/main.jsx)
- Environment: [backend/src/config/env.js](backend/src/config/env.js)
