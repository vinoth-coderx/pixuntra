# Pixuntra

A small image-board app where users can sign up, share images, like, save, and comment in real time.

## Apps in this repo

- Frontend — Next.js app at the project root
- Backend — REST API (Express) with WebSocket support, inside the `server` folder

## Tech used

Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, socket.io-client

Backend: Node.js, Express, MongoDB (Mongoose), socket.io, bcryptjs, cookie-parser, cors

Auth: session cookie stored in MongoDB. Passwords hashed with bcrypt.

## What it can do

- Register and log in
- Browse pins in a masonry feed with search and category filter
- Open a pin to see details, related pins, and comments
- Like and save pins
- Add comments
- View a user profile with their created and saved pins
- See live updates for likes and new comments through websockets
- Light and dark theme

## Folder layout

- `app` — Next.js pages (home, login, register, create, explore, saved, pin, profile)
- `components` — UI, layout, pin, and provider components
- `lib` — API client, socket client, shared types and helpers
- `server/src` — Express app
  - `routes` — auth, pins, users
  - `models` — user, pin, comment, session
  - `middleware/auth.ts` — session cookie handling
  - `realtime.ts` — socket.io setup
  - `db.ts` — MongoDB connection
  - `seed.ts` — demo data

## Run locally

You need Node.js 20+ and MongoDB (local install or Atlas).

Install dependencies:

```
npm install
cd server && npm install && cd ..
```

Create `.env.local` at the root:

```
NEXT_PUBLIC_API_BASE=http://localhost:5050
```

Create `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/pixuntra
CORS_ORIGIN=http://localhost:3000
PORT=5050
```

Start the backend:

```
cd server
npm run dev
```

Start the frontend (in another terminal):

```
npm run dev
```

Open http://localhost:3000.

To load demo data, run `npm run seed` inside `server`.

## API summary

Base URL: `http://localhost:5050`

- `POST /api/auth/register`, `/login`, `/logout`
- `GET /api/auth/me`
- `GET /api/pins` — supports `cursor`, `q`, `category`, `authorId`, `savedBy`, `seed`
- `POST /api/pins` — create a pin
- `GET /api/pins/:id` — pin details with comments and related pins
- `POST /api/pins/:id/like`
- `POST /api/pins/:id/save`
- `POST /api/pins/:id/comments`
- `GET /api/users/:username`

Socket events on `/socket.io`: `pin:join`, `pin:leave`, `like:update`, `comment:new`.

## Deploy

Frontend and backend run as two separate services.

Frontend service: root directory empty, build with `npm install && npm run build`, start with `npm start`. Add `NEXT_PUBLIC_API_BASE` pointing to the backend URL.

Backend service: root directory `server`, build with `npm install && npm run build`, start with `npm start`. Add `MONGODB_URI`, `CORS_ORIGIN` (exact frontend URL), and `NODE_ENV=production`.

## Scripts

Frontend:

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — run the build
- `npm run lint` — lint

Backend:

- `npm run dev` — watch mode
- `npm run build` — compile TypeScript
- `npm start` — run the compiled app
- `npm run seed` — seed demo data
