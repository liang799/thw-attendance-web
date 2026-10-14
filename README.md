# Setup
## Frontend
### Create `.env` file
```.env
# Created by Vercel CLI
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
```

## Backend
### Pre-Requisite
* MySQL

### Setup `.env`
Run backend commands from `backend/`. Install dependencies with `npm ci`, then
copy `.env.example` to `.env` and set the database connection, `JWT_SECRET`, and
`USER_DEFAULT_PASSWORD`. The local `.env` file is ignored by Git.

For Aiven MySQL, use the host, port, database, user, and password from its service
URI as `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`. Set
`DB_SSL_MODE=REQUIRED` to match `ssl-mode=REQUIRED` in the URI. This encrypts the
connection without verifying the server certificate. To verify it, download the
project CA certificate from Aiven, set `DB_SSL_CA_PATH` to its path, and use
`DB_SSL_MODE=VERIFY_IDENTITY`.

### Seeding Database
1. Copy `src/seeders/users/UserData.example.ts` to `src/seeders/users/UserData.ts`
   and edit the users if needed. The example contains five sample users.
2. For an empty database, run `npm run setup-db` to create the schema and seed it.
   This command does not drop existing tables. Do not use it on an existing schema.
3. If the schema already exists and only needs seed data, run `npm run seed-db`.
   Run it only once: the existing seeder inserts new accounts on every run.

Seeded usernames use each name's initials followed by a random number. Query
`SELECT username FROM auth;` to find them. All seeded accounts initially use
`USER_DEFAULT_PASSWORD` from `.env`.

`npm run setup-db:dev` drops and recreates tables. Use it only to intentionally
reset a disposable development database.

Start the backend with `npm run start:dev` (port 3000 by default).

### Vercel
Use the `backend` root directory and the NestJS framework preset for the API.
Configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and
`JWT_SECRET` in the backend project's environment variables. For verified Aiven
TLS, set `DB_SSL_MODE=VERIFY_IDENTITY` and paste the full CA certificate into
`DB_SSL_CA`. This takes precedence over `DB_SSL_CA_PATH`, so deployments do not
need the ignored local `ca.pem` file.

Use the `frontend` root directory and Next.js preset for the frontend. Set
`NEXT_PUBLIC_BACKEND_URL` to the API's production HTTPS URL. If
`NEXT_PUBLIC_BACKEND_URLS` is set, it overrides `NEXT_PUBLIC_BACKEND_URL`; keep
both aligned or use only one. Redeploy after changing environment variables.
Seed the database once from a configured local backend; do not seed during builds.

# Screenshots
![image](https://github.com/user-attachments/assets/cbdfc3a6-380a-441c-9e03-3345b7544908)
![image](https://github.com/user-attachments/assets/6509d198-434a-4105-a95e-4b925ba28e3c)
![image](https://github.com/user-attachments/assets/3c8ff60b-aef4-4cdb-9d10-4de84fe0742c)

![image](https://github.com/user-attachments/assets/f577eb18-ac39-4401-ab61-3cd43c2b3dc5)
![image](https://github.com/user-attachments/assets/d932d32a-6863-40ed-9715-9ec78648db8c)

![image](https://github.com/user-attachments/assets/c68b05c3-e45b-453a-8537-adc9620eb5de)




