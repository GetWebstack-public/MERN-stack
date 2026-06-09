# MERN Stack Template

A production-ready full-stack boilerplate with JWT authentication, a REST API, and a React frontend. Includes a working Todo application to demonstrate the full data flow from browser to database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validation | express-validator |
| Dev runtime | Nodemon (server), CRA dev server (client) |
| Infrastructure | Kubernetes via [GetWebstack](https://getwebstack.com) |

---

## How to Run with GWS

### Prerequisites

- [GWS CLI](https://getwebstack.com/docs/installation/) installed and authenticated
- Docker running locally

### Start the environment

**1. Authenticate with GWS**

```bash
gws login
```

**2. Import the project config**

```bash
gws config import gws.json
```

**3. Set secrets**

```bash
gws secret set JWT_SECRET --service server
```

GWS stores the value encrypted server-side and injects it into the server pod at deploy time as an env var.

**5. Deploy locally**

```bash
gws up -y
```

GWS builds the Docker images, deploys all services to a local k3d cluster, and wires up the gateway. On first run this takes ~2 minutes; subsequent starts are faster.

### Access the app

Once up, open the cookie-setting URL printed by `gws up` to authenticate the gateway:

```
https://client.mern-stack.local.getwebstack.dev:9443/?namespace=<your-namespace>
```

| Service | URL |
|---|---|
| Frontend | `https://client.mern-stack.local.getwebstack.dev:9443` |
| Backend API | `https://server.mern-stack.local.getwebstack.dev:9443/api` |

### Daily commands

```bash
gws up        # start
gws down      # stop
gws status    # pod health + URLs
gws logs server   # server logs
gws logs client   # client logs
```

## Project Architecture

```
MERN-stack/
├── client/                        # React frontend (CRA)
│   ├── public/
│   │   └── index.html             # WebSocket patch for GWS gateway
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js          # Axios instance (baseURL, JWT header, withCredentials)
│   │   │   ├── auth.js            # register / login / getMe
│   │   │   └── todos.js           # CRUD todo calls
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.js      # Sticky nav, auth-aware links
│   │   │   │   └── Footer.js      # Fixed footer with GWS logo
│   │   │   └── ui/
│   │   │       └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js     # Global auth state (login / logout / me)
│   │   ├── hooks/
│   │   │   └── useForm.js         # Controlled form helper
│   │   └── pages/
│   │       ├── HomePage.js        # Hero landing page
│   │       ├── TodoPage.js        # Todo list (auth-gated)
│   │       ├── auth/
│   │       │   ├── LoginPage.js
│   │       │   └── RegisterPage.js
│   │       └── user/
│   │           └── ProfilePage.js
│   └── .gws/services/client/      # GWS Dockerfile + K8s manifests
│
├── server/                        # Express API
│   └── src/
│       ├── index.js               # Entry point (connects DB, starts server)
│       ├── app.js                 # Express app (CORS, routes, error handler)
│       ├── config/
│       │   └── db.js              # Mongoose connection
│       ├── models/
│       │   ├── User.js            # User schema (bcrypt pre-save hook)
│       │   └── Todo.js            # Todo schema (scoped to user)
│       ├── controllers/
│       │   ├── authController.js  # register / login / getMe
│       │   ├── userController.js  # admin CRUD
│       │   └── todoController.js  # todo CRUD (user-scoped)
│       ├── routes/
│       │   ├── auth.js            # POST /api/auth/register|login, GET /api/auth/me
│       │   ├── users.js           # GET|PUT|DELETE /api/users/:id (protected)
│       │   └── todos.js           # GET|POST|PATCH|DELETE /api/todos (protected)
│       └── middleware/
│           ├── auth.js            # JWT protect + admin guards
│           └── errorHandler.js    # Global error middleware
│   └── .gws/services/server/      # GWS Dockerfile + K8s manifests
│
└── gws.json                       # GWS project config (services, Helm charts)
```

### Request flow

```
Browser
  │
  ▼
GWS Gateway (:9443)
  │
  ├──► client pod (React dev server :3000)
  │       └── Axios (withCredentials: true)
  │               │
  │               ▼
  └──► server pod (Express :5000)
          ├── JWT middleware
          ├── express-validator
          ├── Controllers
          └── Mongoose
                  │
                  ▼
            MongoDB pod (:27017)
```

### API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Sign in, returns JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/users` | JWT + admin | List all users |
| GET | `/api/todos` | JWT | List user's todos |
| POST | `/api/todos` | JWT | Create todo |
| PATCH | `/api/todos/:id/toggle` | JWT | Toggle completed |
| DELETE | `/api/todos/:id` | JWT | Delete todo |
| GET | `/api/health` | — | Health check |

---

## Troubleshooting

This project ships with a set of GWS skills compatible with any AI agent (Claude Code, Cursor, Copilot, etc.). Run them from your AI terminal when something goes wrong.

### Quick reference

| Symptom | Skill to run |
|---|---|
| Environment won't start / pods not coming up | `/gws-debug` |
| Want to check overall health after a change | `/gws-status` |
| Need to restart the environment | `/gws-down` then `/gws-up` |

---

### `/gws-status` — Check environment health

Use this first whenever something feels off. It reports pod status, service URLs, file sync sessions, and any unhealthy containers.

```bash
/gws-status
```

Tells you at a glance: which pods are Running / Pending / CrashLoopBackOff, whether file sync is active, and the live service URLs.

---

### `/gws-debug` — Diagnose a failing service

Run this when a pod is crashing, stuck in Pending, or returning unexpected errors. It runs `gws doctor`, reads pod logs, inspects env vars inside the container, and applies fixes automatically where possible.

```bash
/gws-debug
```

---

### `/gws-up` — Start the environment

```bash
/gws-up
```

Runs `gws up -y`, waits for all pods to reach `Running`, and prints the service URLs. Use after `/gws-down` or on a fresh clone.

---

### `/gws-down` — Stop the environment

```bash
/gws-down
```

Gracefully tears down all pods and the gateway. Data in MongoDB is lost (persistence is disabled in dev — see `gws.json` `persistence.enabled: false`).

