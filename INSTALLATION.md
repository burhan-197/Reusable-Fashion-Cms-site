# Installation

## Requirements
- Node.js 20.19.0 or newer
- npm
- MongoDB or MongoDB Atlas

## Setup
```bash
npm install
cp .env.example .env
npm start
```

Edit `.env` before starting:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/forme_lite
SESSION_SECRET=replace-with-a-long-random-secret
SITE_ORIGIN=http://localhost:3000
```

Open `/admin/setup` to create the first and only administrator account. After that, `/admin` sends unauthenticated visitors to the login page.

## Product images
Images are stored locally in `public/uploads/products/`. On production hosting, use persistent disk storage for that directory. Cloudinary and other external storage providers are intentionally not included in the Lite edition.

## Production
Set `NODE_ENV=production`, use HTTPS, a strong session secret, a persistent MongoDB database and persistent local storage for uploads. A process manager and reverse proxy are recommended but not required by the application itself.
