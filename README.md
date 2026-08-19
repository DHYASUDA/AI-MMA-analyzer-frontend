# MMA Fight Hub

A React frontend for exploring UFC events, analyzing fighters, and chatting with an AI assistant. Built with Vite and React Router, it connects to a Java/Spring backend on port 8080.

## Features

- **Authentication** — Sign up and log in against the backend API
- **AI Chat** — Ask questions from the home dashboard
- **UFC Events** — Browse events by year and view fight cards with stats
- **Fighter Analyzer** — Search fighters, view career stats, and get AI-generated breakdowns

## Tech Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [React Markdown](https://github.com/remarkjs/react-markdown) for AI chat responses
- [Axios](https://axios-http.com/) (partial use in `App.jsx`)

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **Backend API** running at `http://localhost:8080` (required for all data and auth)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev
```

During development, Vite proxies `/api` requests to `http://localhost:8080`. Most components call the backend directly at `http://localhost:8080` — see [Configuration](#configuration) before deploying.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Build for production → `dist/`       |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |

## Project Structure

```
src/
├── App.jsx            # Routes and auth state
├── Home.jsx           # AI chat dashboard
├── Login.jsx          # Login form
├── SignUp.jsx         # Registration form
├── UpcomingFights.jsx # UFC event browser
├── FightAnalyzer.jsx  # Fighter search + AI overview
├── HeadToHead.jsx     # (placeholder — not yet implemented)
└── main.jsx           # App entry + BrowserRouter
```

## Routes

| Path               | Auth required | Description              |
| ------------------ | ------------- | ------------------------ |
| `/`                | No            | Landing (Login / Sign up)|
| `/login`           | No            | Login page               |
| `/signup`          | No            | Registration page        |
| `/home`            | Yes           | AI chat dashboard        |
| `/upcomingfights`  | Yes           | UFC events & fight cards |
| `/fightAnalyzer`   | Yes           | Fighter stats & AI       |

## Backend API Endpoints

The frontend expects these endpoints on the backend:

| Method | Endpoint                              | Used by          |
| ------ | ------------------------------------- | ---------------- |
| POST   | `/api/login`                          | Login            |
| POST   | `/api/signUp`                         | Sign up          |
| POST   | `/ai/chat`                            | Home, Analyzer   |
| GET    | `/api/mma/getAllFighters`             | Fight Analyzer   |
| GET    | `/api/mma/get2026Events?year={year}`  | Upcoming Fights  |
| GET    | `/api/mma/getFightDetails?eventName=…`| Upcoming Fights  |

## Configuration

For production, replace hardcoded `http://localhost:8080` URLs with an environment variable.

1. Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

2. Use it in fetch calls:

```js
const API = import.meta.env.VITE_API_BASE_URL;
fetch(`${API}/api/login`, { ... });
```

3. Configure your hosting provider to set `VITE_API_BASE_URL` at build time.

> **Note:** Vite's dev-server proxy in `vite.config.js` only applies during `npm run dev`. It does not affect the production build.

## Deployment Checklist

Before going public, address these items:

- [ ] Replace all `localhost:8080` URLs with `VITE_API_BASE_URL`
- [ ] Persist auth (JWT in httpOnly cookie or secure localStorage) so sessions survive refresh
- [ ] Remove debug code (`console.log`, `alert`, SignUp "testing" button)
- [ ] Stop storing passwords in client-side user state after login
- [ ] Wire up Logout buttons and fix route guard on `/upcomingfights`
- [ ] Fix SignUp → Login navigation (`/signUp` vs `/signup` casing)
- [ ] Add a 404 route and update `index.html` title/branding
- [ ] Enable HTTPS and configure CORS on the backend
- [ ] Resolve ESLint errors (`npm run lint`)
- [ ] Set `"private": false` in `package.json` if publishing to npm (optional for app deploys)

## Known Limitations

- Auth state lives in React memory only — refreshing the page logs the user out
- No error boundaries or global error handling
- `HeadToHead.jsx` is an empty placeholder
- Some UI uses `alert()` instead of inline error messages

## License

Private project — add a license if you plan to open-source it.
