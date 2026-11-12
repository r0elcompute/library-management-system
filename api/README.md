# Library Management System

A robust backend data layer and API service built with **NestJS, Prisma ORM, and PostgreSQL (hosted on Neon)** for managing a library's book catalog, patrons, librarians, and reviews.

## Features

- **Role-Based User Management:** Distinct roles for `PATRON` and `LIBRARIAN` users.
- **Catalog Management:** Organize books efficiently by distinct categories through a normalized `Genre` relationship.
- **User Reviews & Ratings:** Allow patrons to rate and comment on books, with cascading deletions to maintain data integrity.
- **Automated Seeding:** Built-in seed scripts to quickly populate initial genres and books.

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── generated/prisma/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── .env.example
│   └── prisma7.config.ts
└── README.md
```

## Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database instance (e.g., Neon)

### 2. Installation

Navigate into the `api` directory and install the dependencies:

```bash
cd api
npm install
```

### 3. Environment Variables

Create a `.env` file in the `api` directory based on `.env.example`:

```ini
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:password@host:port/database?sslmode=require"
```

### 4. Database Migration & Seeding

Run Prisma migrations and populate your database using the seed script:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Schema Decisions

### Why Book References Genre Rather Than Embedding It

We chose a normalized relational approach, modeling `Genre` as its own separate entity and relating `Book` to it through a `genreId` foreign key, instead of embedding genre data directly inside the `Book` model.

This decision offers several advantages:

1. **Data Integrity & Consistency:** If a genre name needs to be updated (e.g., fixing a typo or changing "Sci-Fi" to "Science Fiction"), it only needs to be updated in one place (`Genre` table) rather than modifying every individual book record.

2. **Reduced Redundancy:** Storing string values for genres repeatedly across thousands of book rows introduces unnecessary data duplication and storage overhead.

3. **Query Efficiency & Flexibility:** A normalized structure makes it seamless to query all books belonging to a specific genre, filter by genre dynamically, and manage metadata (such as genre descriptions) centrally.