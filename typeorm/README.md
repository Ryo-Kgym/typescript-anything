# TypeORM CRUD Example with Next.js

This is a Next.js application demonstrating CRUD operations with TypeORM and PostgreSQL.

## Features

- Create, Read, Update, and Delete operations for User entities
- TypeORM integration with PostgreSQL
- Docker Compose setup for PostgreSQL database
- Single page UI for all CRUD operations

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Start the PostgreSQL Database

From the root directory (where the docker-compose.yml file is located), run:

```bash
docker-compose up -d
```

This will start a PostgreSQL database container with the following configuration:
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: typeorm

### 2. Configure Environment Variables

Copy the provided `.env.example` file to `.env.local` and customize the values as needed:

```bash
cp .env.example .env.local
```

The `.env.local` file should contain the following variables:

```
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=typeorm
DB_SYNCHRONIZE=true
```

The `DB_SYNCHRONIZE` variable controls whether TypeORM automatically creates database tables. Set to `true` for development, but consider setting it to `false` for production and using proper migrations instead.

You can customize these values to match your database configuration. These environment variables are used both by the application and the Docker Compose setup.

### 3. Install Dependencies

Install the dependencies:

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

The application provides a simple UI for managing users:

1. **Create a User**: Fill in the form at the top of the page and click "Create User"
2. **View Users**: All users are displayed in the table below the form
3. **Update a User**: Click the "Edit" button next to a user, modify the form, and click "Update User"
4. **Delete a User**: Click the "Delete" button next to a user

## Project Structure

- `src/app/page.tsx`: Main UI component with CRUD functionality
- `src/app/api/users/route.ts`: API routes for listing and creating users
- `src/app/api/users/[id]/route.ts`: API routes for getting, updating, and deleting a specific user
- `src/database/connection.ts`: TypeORM database connection configuration
- `src/database/entity/user.ts`: User entity definition
- `src/database/repository/user-repository.ts`: Repository for User entity CRUD operations

## Notes

- The application uses TypeORM's `synchronize` option, which is controlled by the `DB_SYNCHRONIZE` environment variable. When set to `true`, it automatically creates database tables. This is convenient for development but not recommended for production.
- For production use, consider setting `DB_SYNCHRONIZE=false` and implementing proper database migrations.
- The application validates required environment variables at startup. If any required variables are missing, the application will throw an error with a clear message indicating which variable is missing.

### Environment Variables

The following environment variables are required:

- `DB_HOST`: Database host (e.g., "localhost")
- `DB_PORT`: Database port (e.g., "5432")
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name

Optional environment variables:

- `DB_SYNCHRONIZE`: Whether to automatically create database tables (default: "false")
- `NODE_ENV`: Application environment (default: "development")
