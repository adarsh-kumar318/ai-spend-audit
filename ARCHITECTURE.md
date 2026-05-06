# Architecture

## Stack
- **Frontend**: React (Create React App), Tailwind CSS (v3 via built-in PostCSS support), React Router DOM, Axios.
- **Backend**: Node.js, Express.js, Mongoose, Nodemailer, Express-Rate-Limit, Nanoid.
- **Database**: MongoDB Atlas.

## Data Flow
1. User enters tools on `/`.
2. Frontend evaluates savings via `runAudit` logic locally.
3. On submit, frontend POSTs to `/api/audit/create` which saves anonymous audit data and generates a `shareId`.
4. User enters email to get report -> POST `/api/audit/email` updates record and triggers Nodemailer.
5. User gets shareable link `/audit/:shareId`.
6. Visitor views `/audit/:shareId` -> GET `/api/audit/:id` (returns safe data without email).
