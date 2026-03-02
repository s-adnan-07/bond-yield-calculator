# Bond Yield Calculator

A monorepo containing a bond yield calculator with a NestJS backend and a React (Vite) frontend.

**Node version used to build the apps:** 22.21.1

---

## Running with Docker

### Prerequisites

- Docker and Docker Compose
- Node 22.21.1 (only if you need to build images on a host that matches the project)

### Environment variables

Place a single `.env` file at the **root of the repository** (same directory as `docker-compose.yml`). Both the backend and frontend services read from this file.

| Variable                 | Description                                  | Example                                      |
| ------------------------ | -------------------------------------------- | -------------------------------------------- |
| `SERVER_PORT`            | Port the backend listens on                  | `5000`                                       |
| `API_PREFIX`             | Global API path prefix for the backend       | `api`                                        |
| `VITE_SERVER_URL`        | Backend API base URL (for frontend)          | `http://localhost:5000/api`                  |
| `CLIENT_PORT`            | Port used to expose the frontend             | `4000`                                       |
| `THROTTLE_TTL`           | Rate limit: time window in milliseconds      | `60000`                                      |
| `THROTTLE_LIMIT`         | Rate limit: max requests per TTL window      | `100`                                        |
| `THROTTLE_ERROR_MESSAGE` | Message returned when rate limit is exceeded | `Too many requests. Please try again later.` |

**Example root `.env`:**

```env
# Backend
SERVER_PORT=5000
API_PREFIX=api

# Rate limiting (optional; defaults shown)
# THROTTLE_TTL=60000
# THROTTLE_LIMIT=100
# THROTTLE_ERROR_MESSAGE=Too many requests. Please try again later.

# Frontend
VITE_SERVER_URL=http://localhost:5000/api
CLIENT_PORT=4000
```

### Start the application

From the repository root:

```bash
docker compose up --build
```

- **Backend:** http://localhost:5000/api (or the port set in `SERVER_PORT`)
- **Frontend:** http://localhost:4000 (or the port set in `CLIENT_PORT`)

To run in the background:

```bash
docker compose up --build -d
```

---

## Running without Docker

### Prerequisites

- Node.js **22.21.1**
- pnpm (>= 9.0.0); the repo uses a pnpm workspace

### Environment variables

Use **two separate `.env` files** when running backend and frontend locally.

#### 1. Backend — `backend/.env`

Create `backend/.env` with:

| Variable                 | Description                                  | Example                                      |
| ------------------------ | -------------------------------------------- | -------------------------------------------- |
| `SERVER_PORT`            | Port the backend listens on                  | `5000`                                       |
| `API_PREFIX`             | Global API path prefix                       | `api`                                        |
| `THROTTLE_TTL`           | Rate limit: time window in milliseconds      | `60000`                                      |
| `THROTTLE_LIMIT`         | Rate limit: max requests per TTL window      | `100`                                        |
| `THROTTLE_ERROR_MESSAGE` | Message returned when rate limit is exceeded | `Too many requests. Please try again later.` |

**Example `backend/.env`:**

```env
SERVER_PORT=5000
API_PREFIX=api

# Optional: rate limiting (defaults: TTL=60000, LIMIT=100)
# THROTTLE_TTL=60000
# THROTTLE_LIMIT=100
# THROTTLE_ERROR_MESSAGE=Too many requests. Please try again later.
```

#### 2. Frontend — `frontend/.env`

Create `frontend/.env` with:

| Variable          | Description                         | Example                     |
| ----------------- | ----------------------------------- | --------------------------- |
| `VITE_SERVER_URL` | Backend API base URL (used by Vite) | `http://localhost:5000/api` |

**Example `frontend/.env`:**

```env
VITE_SERVER_URL=http://localhost:5000/api
```

`VITE_SERVER_URL` must match the backend URL and port you use (e.g. if `SERVER_PORT` is 5000, use `http://localhost:5000/api` with the same `API_PREFIX`).

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Start the backend

From the repository root:

```bash
pnpm dev:backend
```

Or from `backend/`:

```bash
pnpm run start:dev
```

Backend runs at http://localhost:5000 (or your `SERVER_PORT`), with API under `/api`.

### Start the frontend

In a second terminal, from the repository root:

```bash
pnpm dev:frontend
```

Or from `frontend/`:

```bash
pnpm run dev
```

Frontend runs at the URL shown in the terminal (typically http://localhost:5173 for Vite).

---

## Test scripts

From the repository root you can run live tests against a running backend and/or frontend.

| Command                   | Description                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `pnpm test:live:api`      | Runs live API tests against the backend. Expects the backend at `http://localhost:5000/api` (or set `API_BASE_URL`). |
| `pnpm test:live:frontend` | Runs live frontend smoke tests. Expects the frontend at `http://localhost:4000` (or set `FRONTEND_URL`).             |
| `pnpm test:live`          | Runs both `test:live:api` and `test:live:frontend` in sequence.                                                      |

**How to run them**

1. Start the app (Docker or `pnpm dev:backend` + `pnpm dev:frontend`).
2. From the repo root run:
   - `pnpm test:live:api` — backend must be up.
   - `pnpm test:live:frontend` — frontend must be up (e.g. dev server or Docker).
   - `pnpm test:live` — both must be up.

**Optional environment variables for tests**

| Variable                       | Used by              | Description                                                  |
| ------------------------------ | -------------------- | ------------------------------------------------------------ |
| `API_BASE_URL`                 | `test:live:api`      | Backend API base URL (default: `http://localhost:5000/api`). |
| `FRONTEND_URL`                 | `test:live:frontend` | Frontend URL to test (default: `http://localhost:4000`).     |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Both                 | Set to `0` to allow HTTPS with self-signed certificates.     |

Example with custom URLs:

```bash
API_BASE_URL=http://localhost:5000/api FRONTEND_URL=http://localhost:4000 pnpm test:live
```

---

## Summary

| Run mode      | `.env` location      | Contents                                                                                          |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| **Docker**    | **Root** (repo root) | `SERVER_PORT`, `API_PREFIX`, `VITE_SERVER_URL`, `CLIENT_PORT`, optional: `THROTTLE_*`             |
| **No Docker** | **backend/.env**     | `SERVER_PORT`, `API_PREFIX`, optional: `THROTTLE_TTL`, `THROTTLE_LIMIT`, `THROTTLE_ERROR_MESSAGE` |
| **No Docker** | **frontend/.env**    | `VITE_SERVER_URL`                                                                                 |
