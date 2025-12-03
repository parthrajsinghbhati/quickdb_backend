# QuickDB Backend

The backend API for QuickDB, providing authentication, database management, and dynamic data handling capabilities.

**Live URL:** [https://quickdb-backend.onrender.com](https://quickdb-backend.onrender.com)

## Features

- **Authentication**: JWT-based authentication for secure access.
- **Database Operations**: CRUD operations for user-created databases.
- **Table Management**: Dynamic schema management for tables within databases.
- **Data API**: Generic endpoints to read and write data to user-defined tables.
- **Cascade Delete**: Automatically cleans up related tables and records when a database is deleted.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd QuickDB/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Push schema to database:
   ```bash
   npx prisma db push
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start the server in development mode.
- `npm start`: Start the server in production mode.
- `npm run prisma:generate`: Generate the Prisma client.
- `npm run prisma:studio`: Open Prisma Studio to view data.

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive a token.

### Databases
- `GET /api/databases`: List user databases (supports pagination, search, sorting).
- `POST /api/databases`: Create a new database.
- `GET /api/databases/:id`: Get database details.
- `DELETE /api/databases/:id`: Delete a database.

### Tables
- `GET /api/tables`: List tables in a database.
- `POST /api/tables`: Create a new table.
- `DELETE /api/tables/:id`: Delete a table.

### Data
- `GET /api/data/:tableId`: Get records from a table.
- `POST /api/data/:tableId`: Add a record to a table.
