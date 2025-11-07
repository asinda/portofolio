# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

**IMPORTANT**: Always respond in French when working with this codebase. The project owner is French-speaking and all documentation, comments, and interactions should be in French.

## Project Overview

Professional portfolio for Alice Sindayigaya with a modern frontend/backend architecture.

- **LinkedIn**: [alicesindayigaya](https://www.linkedin.com/in/alicesindayigaya)
- **GitHub**: [asinda](https://github.com/asinda)
- **Architecture**: Separated frontend (vanilla JS) and backend (Node.js + Express + Supabase)

## Tech Stack

### Backend
- **Runtime**: Node.js v18+ with ES modules (`"type": "module"`)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Security**: Helmet, CORS, Express Rate Limiting
- **Dependencies**: `@supabase/supabase-js`, `cheerio`, `cors`, `dotenv`, `express`, `express-rate-limit`, `helmet`, `multer`, `node-fetch`

### Frontend
- **Pure vanilla**: HTML5, CSS3, JavaScript ES6+ (no framework, no build system)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Playfair Display)
- **Features**: Dark/light mode, responsive design, Intersection Observer animations, typewriter effect

## Development Commands

### Backend

```bash
cd backend

# Install dependencies (first time only)
npm install

# Setup environment variables (first time only)
cp .env.example .env
# Then edit .env with Supabase credentials

# Development mode with auto-reload (nodemon)
npm run dev

# Production mode
npm start
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend/public

# Using Python (recommended for dev)
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Frontend accessible at:
- Portfolio: `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin`

## Architecture

### Backend Structure (`backend/`)

```
backend/
├── server.js                    # Entry point, middleware setup, route registration
├── src/
│   ├── config/
│   │   └── supabase.js         # Supabase client initialization
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── cors.js             # CORS configuration
│   ├── routes/
│   │   ├── auth.js             # Auth routes (login, register, logout, user)
│   │   └── portfolio.js        # Portfolio CRUD routes (all entities)
│   ├── controllers/
│   │   ├── profileController.js # Profile-specific logic
│   │   └── crudController.js    # Generic CRUD controller for all entities
│   └── data.json               # Fallback data (used when Supabase unavailable)
```

**Key architectural patterns**:
- **Generic CRUD controller**: `crudController.js` exports a factory function that creates CRUD operations for any Supabase table
- **Auth middleware**: Protects routes that modify data (POST/PUT/DELETE)
- **Rate limiting**: 100 requests per 15 minutes per IP on all `/api/` routes

### Frontend Structure (`frontend/public/`)

```
public/
├── index.html              # Main portfolio page (single page)
├── admin/                  # Admin panel
│   └── (admin files)
├── css/
│   └── styles.css          # All styles (CSS variables, responsive)
├── js/
│   ├── apiConfig.js        # API base URL configuration
│   └── script.js           # Main logic (data loading, animations, interactions)
├── images/                 # Portfolio images
└── assets/                 # Downloadable files (CV, etc.)
```

**Key frontend patterns**:
- **Data loading**: `script.js` tries to fetch from backend API first, falls back to local `data.json` if unavailable
- **Theme management**: Uses `data-theme` HTML attribute with localStorage persistence
- **Animations**: Intersection Observer for scroll animations, custom typewriter effect
- **No build step**: All files are served statically as-is

## Important Configuration Files

### Backend `.env` (required)

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000
```

### Frontend `apiConfig.js`

Toggle between local development and production API:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://your-production-api.com/api';
```

## Database Schema (Supabase)

The backend expects these tables in Supabase:
- `profile` - User profile information
- `experiences` - Work experience entries
- `education` - Educational background
- `projects` - Portfolio projects
- `technical_skills` - Technical skills
- `languages` - Language proficiency
- `soft_skills` - Soft skills
- `certifications` - Certifications and achievements

**Setup**: Run SQL scripts in [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) to create all tables.

## API Routes

### Public (no auth)
- `GET /api/health` - Health check
- `GET /api/portfolio/profile` - Get profile
- `GET /api/portfolio/experience` - List experiences
- `GET /api/portfolio/education` - List education
- `GET /api/portfolio/projects` - List projects
- `GET /api/portfolio/skills/technical` - Technical skills
- `GET /api/portfolio/skills/languages` - Languages
- `GET /api/portfolio/skills/soft` - Soft skills
- `GET /api/portfolio/certifications` - Certifications

### Protected (require JWT auth)
- `POST /api/auth/login` - Login
- `POST /api/portfolio/{entity}` - Create entry
- `PUT /api/portfolio/{entity}/:id` - Update entry
- `DELETE /api/portfolio/{entity}/:id` - Delete entry

**Auth header**: `Authorization: Bearer <jwt_token>`

## Common Development Workflows

### Adding a new portfolio entity type

1. **Backend**: The generic `crudController.js` handles most CRUD operations automatically. For a new table `foo`:
   ```javascript
   // In routes/portfolio.js
   import { getCrudController } from '../controllers/crudController.js';
   const fooController = getCrudController('foo');
   router.get('/foo', fooController.getAll);
   router.post('/foo', authMiddleware, fooController.create);
   // etc.
   ```

2. **Database**: Add table to Supabase with proper schema

3. **Frontend**: Update `script.js` to fetch and display the new entity

### Modifying styles

Edit `frontend/public/css/styles.css`. Key sections:
- Lines 1-30: CSS variables (colors, spacing, fonts)
- Theme-specific variables in `:root` and `[data-theme="dark"]`
- Responsive breakpoints at bottom (@media queries)

### Testing API endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get profile (public)
curl http://localhost:5000/api/portfolio/profile

# Create experience (protected - requires JWT)
curl -X POST http://localhost:5000/api/portfolio/experience \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"position":"Developer","company":"ACME","start_date":"2024-01"}'
```

## Deployment

### Backend
- **Recommended platforms**: Heroku, Railway, Render
- **Required env vars**: All variables from `.env.example`
- **Important**: Set `NODE_ENV=production` and update `ALLOWED_ORIGINS` with frontend URL

### Frontend
- **Recommended platforms**: GitHub Pages, Netlify, Vercel
- **Deploy**: Upload contents of `frontend/public/` folder
- **Important**: Update `apiConfig.js` with production API URL

## Troubleshooting

**CORS errors**: Add frontend origin to `ALLOWED_ORIGINS` in backend `.env`

**Supabase connection fails**: Verify `.env` has correct `SUPABASE_URL` and keys. Check [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

**Frontend shows "fallback mode"**: Backend is unreachable. Verify it's running on correct port and CORS is configured

**Auth token invalid**: Tokens expire. Re-login through admin panel to get fresh JWT

**Images not loading**: Check paths in database match actual files in `frontend/public/images/`

## Code Style Conventions

- **Language**: All code comments, commit messages, and documentation in French
- **Backend**: Use ES modules (`import/export`), async/await for async operations
- **Frontend**: Vanilla JS (no frameworks), use modern ES6+ features
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Error handling**: Always return proper HTTP status codes and JSON error responses

## Testing

Currently no automated tests are configured. To add tests:

```bash
# In backend/
npm install --save-dev jest supertest
# Create tests in backend/tests/
```

## Documentation Files

- [README.md](README.md) - Main project overview and setup guide
- [backend/README.md](backend/README.md) - Backend API documentation
- [frontend/README.md](frontend/README.md) - Frontend features and customization
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) - Complete Supabase setup guide
- [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) - Admin panel usage guide
