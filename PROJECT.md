# Pixuntra

A clean, modern image-board where people can share pictures, follow what they like, and talk about it together.

> Successfully completed and deployed end-to-end — frontend, backend, database, and real-time layer all live.

---

## Links

- **Live app** — <live-url-here>
- **Source code** — <github-url-here>

---

## What it does

Sign up, log in, and you're in. Browse a flowing masonry feed of pins, search by keyword, filter by category, and open any pin to see its details and related ideas. Save the ones you love, like them, leave a comment, and watch the likes and comments update for everyone in real time. Each profile has its own page with everything that person has created and saved.

---

## Built with

**Frontend**
Next.js 16 · React 19 · TypeScript · Tailwind CSS · socket.io-client

**Backend**
Node.js · Express · MongoDB (Mongoose) · socket.io · bcryptjs · session cookies

**Hosting**
Frontend and backend deployed as two services on Render. MongoDB hosted on Atlas.

---

## Highlights

- Cookie-based session auth with bcrypt-hashed passwords
- Cursor-paginated feed with text search and category filters
- Live likes and comments through WebSocket rooms (one room per pin)
- Profile pages with separate tabs for created and saved pins
- Light and dark theme
- Fully responsive masonry layout
- TypeScript end-to-end for safer changes

---

## Run it locally

```
npm install
cd server && npm install && cd ..
```

Add `.env.local` at the root:

```
NEXT_PUBLIC_API_BASE=http://localhost:5050
```

Add `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/pixuntra
CORS_ORIGIN=http://localhost:3000
PORT=5050
```

Start the backend, then the frontend:

```
cd server && npm run dev
```

```
npm run dev
```

Open http://localhost:3000.

---

## Status

The build, deployment, authentication, real-time layer, and all core flows are working in production. The project is complete and ready to use.

Thank you for reviewing.
