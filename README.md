# Synapse Web

Modern conversational platform built with React, TypeScript and real-time communication.

Synapse Web is the frontend application of the Synapse Platform, a SaaS-oriented conversational management system focused on chatbot flows, automation, analytics and customer interaction.

---

## Features

- JWT authentication
- Protected routes
- Real-time communication *(planned)*
- Chatbot flow builder *(planned)*
- Drag and drop interface *(planned)*
- Analytics dashboard *(planned)*
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
- React Flow *(planned)*
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

## Getting Started

### Prerequisites

- Node.js 20+
- [synapse-api](https://github.com/hiagokodato/synapse-api) running locally on port 3000

### Setup

```powershell
cd synapse-web
npm install
cp .env.example .env   # or copy manually on Windows
npm run dev
```

App: http://localhost:5173  
API: http://localhost:3000/v1

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
| 3 — Flow builder | 🔲 | React Flow |
| 4 — Conversations | 🔲 | Socket.io realtime |
| 5 — Analytics | 🔲 | Charts + Vercel deploy |

---

## Environment

```env
VITE_API_URL=http://localhost:3000/v1
```

Do not commit `.env` files — use `.env.example` as reference.
