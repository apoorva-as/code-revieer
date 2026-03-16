# Code Revieer

AI-powered code review web application built with React, Vite, Express, and Google Gemini.

The app lets users paste code into an editor, send it for AI review, and receive structured feedback about readability, bugs, security issues, and improvement opportunities.

## Live Demo

- Frontend: https://code-revieer.vercel.app
- Backend: https://code-revieer-backend.onrender.com

## Features

- Modern landing page with hero, feature highlights, testimonials, and contact section
- Try-without-login flow for instant access to the reviewer UI
- Syntax-highlighted code editor
- AI-generated code review output with markdown rendering
- Backend API powered by Google Gemini
- Separate frontend and backend deployment setup

## Tech Stack

- Frontend: React 19, Vite, Axios, PrismJS, React Markdown
- Backend: Node.js, Express, CORS, dotenv, Google GenAI SDK
- Deployment: Vercel for frontend, Render for backend

## Project Structure

```text
code revieer/
|- Backend/
|  |- server.js
|  |- package.json
|  |- .env.example
|  \- src/
|     |- app.js
|     |- controllers/
|     |- routes/
|     \- services/
|- Frontend/
|  |- package.json
|  |- .env.example
|  \- src/
|     |- App.jsx
|     |- LandingPage.jsx
|     |- CodeReviewer.jsx
|     \- *.css
\- README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "code revieer"
```

### 2. Install dependencies

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

### 3. Configure environment variables

Backend `.env`

```env
GOOGLE_GEMINI_KEY=your_google_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
PORT=3000
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

### 4. Start the backend

```bash
cd Backend
npm run dev
```

### 5. Start the frontend

```bash
cd Frontend
npm run dev
```

The frontend usually runs on `http://localhost:5173` or `http://localhost:5174`.

## API

### Health check

```http
GET /
```

Response:

```text
Hello World!
```

### Review code

```http
POST /ai/get-review
Content-Type: application/json
```

Request body:

```json
{
  "code": "function sum(){ return 1 + 1 }"
}
```

## Deployment

### Frontend on Vercel

- Root directory: `Frontend`
- Environment variable:

```env
VITE_API_URL=https://code-revieer-backend.onrender.com
```

### Backend on Render

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:

```env
GOOGLE_GEMINI_KEY=your_google_gemini_api_key_here
ALLOWED_ORIGINS=https://code-revieer.vercel.app
```

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm start
```

## Notes

- `VITE_API_URL` must be set in Vercel before deploying the frontend.
- `ALLOWED_ORIGINS` must match the deployed frontend URL exactly, without a trailing slash.
- If Render is on the free plan, the backend may sleep after inactivity and take a few seconds to wake up.

## Future Improvements

- Real authentication for login and signup flows
- Review history for signed-in users
- Language selector for different code parsers
- Export and share reviewed output

## License

This project is for learning and portfolio use.
