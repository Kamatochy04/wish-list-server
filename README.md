# Wishlist API

A TypeScript-based API for managing wishlists, events, gifts, and public interactions.

## Tech Stack

- **Backend**: Express, TypeScript, Node.js
- **Database**: PostgreSQL with Prisma
- **Cache**: Redis
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Validation**: Zod
- **Documentation**: Swagger
- **Dev Tools**: Husky, Prettier, ESLint, lint-staged, Commitlint

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- Redis

## Setup

1. Clone the repository:
   git clone <repository-url>
   cd wishlist-api

Install dependencies:

npm install

Set up environment variables in .env:
DATABASE_URL=postgresql://user:password@localhost:5432/wishlist?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=
EMAIL_PASS=
PORT=3000

Run migrations:
npx prisma migrate dev

Start MailHog for email testing:
docker run --name mailhog -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

Start the application:
npm run dev

Or with Docker:
docker-compose up --build

Development Tools
Prettier: Auto-formats code. Run npm run format to format all files.
ESLint: Lints TypeScript code. Run npm run lint to check or npm run lint:fix to fix issues.
Husky: Runs lint-staged before commits.

Scripts
npm run build: Compile TypeScript to JavaScript.
npm run start: Run compiled app.
npm run dev: Run with nodemon for development.
npm run lint: Run ESLint.
npm run lint:fix: Fix ESLint issues.
npm run format: Run Prettier.
npm run format:check: Check Prettier compliance.
API Documentation

Access Swagger UI at http://localhost:3000/api-docs.
# wish-list-server
