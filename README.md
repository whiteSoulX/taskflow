# TaskFlow — Full-Stack Portfolio Project

A ready-to-deploy demo app built with **Next.js/React** on the frontend and
**Django REST Framework** on the backend — designed to showcase exactly the
stack advertised in the "Custom Full-Stack App" gig package (JWT auth,
database setup, REST API, responsive UI).

4 pages: Landing → Register → Login → Dashboard (protected, full CRUD).

## Features
- Full task CRUD — create, edit, mark complete/incomplete with a single click, delete.
- **Deadline notifications** — a bell icon in the navbar badges overdue/due-soon tasks
  and lists them in a dropdown; the dashboard also toasts a summary on load and shows
  an inline banner while anything is overdue or due within 2 days.
- Overdue and due-soon tasks are visually flagged on their cards (red/amber borders + labels).
- Search, status/priority filters, and sorting (newest, due date, priority) on the dashboard.
- JWT auth with automatic access-token refresh.

## Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Axios, lucide-react
- **Backend:** Django 5, Django REST Framework, SimpleJWT, django-cors-headers
- **Database:** SQLite by default, one env var away from PostgreSQL
- **Deployment:** Dockerfile + gunicorn + whitenoise for the API, Vercel-ready frontend

## Project structure
```
taskflow-portfolio/
├── backend/          Django REST API
│   ├── core/         settings, urls, wsgi/asgi
│   ├── accounts/     register / login (JWT) / me
│   └── tasks/        Task model + CRUD API (per-user)
└── frontend/         Next.js app
    ├── app/           pages: /, /login, /register, /dashboard
    ├── components/    Navbar, TaskCard, TaskForm, StatsCard, ProtectedRoute
    └── lib/           api client + auth helpers
```

## Local setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin
python manage.py runserver
```
API runs at `http://localhost:8000/api/`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
App runs at `http://localhost:3000`.

## API endpoints
| Method | Endpoint                  | Description              |
|--------|----------------------------|---------------------------|
| POST   | /api/auth/register/       | Create account            |
| POST   | /api/auth/login/          | Get access + refresh JWT  |
| POST   | /api/auth/refresh/        | Refresh access token      |
| GET    | /api/auth/me/             | Current user              |
| GET    | /api/tasks/               | List your tasks (supports `?status=`, `?priority=`, `?search=`, `?ordering=due_date\|priority\|created_at`, prefix `-` to reverse) |
| POST   | /api/tasks/               | Create a task             |
| PUT    | /api/tasks/{id}/          | Update a task             |
| DELETE | /api/tasks/{id}/          | Delete a task             |

## Deploying

**Backend (Render / Railway / DigitalOcean App Platform, or any Docker host):**
1. Push `backend/` to a repo (or the whole project — it builds standalone).
2. Point the host at the included `Dockerfile`, or run
   `gunicorn core.wsgi:application` directly if not using Docker.
3. Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL`
   (Postgres connection string), `CORS_ALLOWED_ORIGINS` (your Vercel URL).
4. Run `python manage.py migrate` once on the host (Render/Railway both
   support a one-off release command for this).

**Frontend (Vercel):**
1. Import the `frontend/` folder as a new Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to your deployed backend's `/api` URL.
3. Deploy — Vercel auto-detects Next.js, no extra config needed.

## Notes
- Every task is scoped to `request.user`, so users only ever see their own data.
- Access tokens auto-refresh via an axios interceptor — no manual re-login needed within the refresh window.
- Swap in PostgreSQL for production simply by setting `DATABASE_URL`; no code changes required.
