I have successfully updated your project to use PostgreSQL, added the requested fields to the User model, and created a seeder.

Here is a summary of the changes:

1.  **Database Configuration**:
    - Updated `.env` to use a PostgreSQL connection string (`postgresql://postgres:postgres@localhost:5433/zek-reservation?schema=public`).
    - Updated `prisma/schema.prisma` to use the `postgresql` provider.
2.  **User Model**:
    - Updated the `User` model with `firstName`, `lastName`, `username`, `email`, `phoneNumber`, `password`, `role`, `createdAt`, and `updatedAt`.
    - Added a `Role` enum (ADMIN, STAFF, USER).
3.  **Validation**:
    - Updated the Zod schema in `src/lib/validations/user.ts` to validate all new fields.
4.  **API**:
    - Updated `src/app/api/users/route.ts` to handle the new fields in POST requests and return them in GET requests.
5.  **Seeder**:
    - Created `prisma/seed.ts` to seed an Admin and a Staff user.
    - Added a `seed` script to `package.json` using `ts-node`.

**Next Steps for You:**

1.  **Start PostgreSQL**: Ensure you have a PostgreSQL server running locally on port 5433 with a database named `zek-reservation` (or allow Prisma to create it) and credentials `postgres:postgres` (or update `.env` with your credentials).
2.  **Run Migration**:
    ```bash
    npx prisma migrate dev --name init_postgres
    ```
3.  **Run Seeder**:
    ```bash
    npx prisma db seed
    ```
4.  **Start the App**:
    ```bash
    npm run dev
    ```

The code is now ready and configured. Once your database is running, the migration and seeding will work.
