# Synapse Web

Modern conversational platform built with React, TypeScript and real-time communication.

Synapse Web is the frontend application of the Synapse Platform, a SaaS-oriented conversational management system focused on chatbot flows, automation, analytics and customer interaction.

---

## Features

- JWT authentication
- Protected routes
- Real-time communication *(planned)*
- Chatbot flow builder
- Drag and drop interface (React Flow)
- Analytics dashboard *(partial — overview metrics)*
- Conversation monitoring *(planned)*
- API integrations management *(planned)*
- Responsive layout
- Dark mode
- Role-based permissions
- Notification system *(planned)*
- Reusable component architecture

---

## Tech Stack

- React 19 + TypeScript
- Vite 8
- TailwindCSS 4
- React Router 7
- React Query
- Zustand
- React Hook Form + Zod
- Axios
- React Flow
- Socket.io Client *(planned)*

---

## Architecture

```bash
src/
 ├── app/           # App shell + providers
 ├── components/    # Shared UI components
 ├── features/      # Feature modules (auth, chatbots, etc.)
 ├── hooks/
 ├── layouts/       # AuthLayout, AppLayout
 ├── pages/
 ├── routes/        # Protected / public route guards
 ├── services/      # API clients
 ├── stores/        # Zustand stores
 ├── types/
 └── utils/
```

---

## Production

| App | URL |
|-----|-----|
| **Web (Vercel)** | https://synapse-web-mocha.vercel.app |
| **API (Railway)** | https://synapse-api-production-5368.up.railway.app/v1 |
| **Swagger** | https://synapse-api-production-5368.up.railway.app/docs |

### Vercel environment

```env
VITE_API_URL=https://synapse-api-production-5368.up.railway.app/v1
```

### Railway CORS

```env
CORS_ORIGIN=http://localhost:5173,https://synapse-web-mocha.vercel.app
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- [synapse-api](https://github.com/hiagokodato/synapse-api) — local (`:3000`) or hosted (Railway)

### Setup (local)

```powershell
cd synapse-web
npm install
copy .env.example .env
npm run dev
```

App: http://localhost:5173  
API: http://localhost:3000/v1

### Setup (production API)

Point the frontend to your hosted API:

```env
VITE_API_URL=https://synapse-api-production-5368.up.railway.app/v1
```

On **Railway** (synapse-api), set `CORS_ORIGIN` to your frontend origin(s), comma-separated:

```env
CORS_ORIGIN=http://localhost:5173,https://synapse-web-mocha.vercel.app
```

| Resource | URL |
|----------|-----|
| Health | https://synapse-api-production-5368.up.railway.app/v1/health |
| Swagger | https://synapse-api-production-5368.up.railway.app/docs |
| WebSocket | `wss://synapse-api-production-5368.up.railway.app/realtime` |

### Deploy (Vercel)

1. Import repo `synapse-web` from GitHub
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://synapse-api-production-5368.up.railway.app/v1`
6. Deploy branch with the app code (`develop` or `main`)

`vercel.json` is included for SPA routing (React Router).

**Live URL:** https://synapse-web-mocha.vercel.app

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run lint` | ESLint                   |
| `npm run preview` | Preview production build |

---

## Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| 1 — Foundation | ✅ | Auth, routing, layout |
| 2 — Chatbots | ✅ | Dashboard + CRUD |
| 3 — Flow builder | ✅ | React Flow |
| 4 — Conversations | 🔲 | Socket.io realtime |
| 5 — Analytics | 🔲 | Charts (deploy ✅ Vercel) |

---

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | REST base URL (e.g. `https://…/v1`) |
| `VITE_WS_URL` | Optional WebSocket URL for Fase 4 (defaults from API URL) |

See `.env.example` (local) and `.env.production.example` (hosted API).

Do not commit `.env` files — use the examples as reference.
