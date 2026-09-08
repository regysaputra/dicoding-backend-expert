# Forum API

RESTful API for a discussion forum — threads, comments, and replies with JWT-based
authentication. Built as the submission for the Dicoding class
_"Menjadi Backend Developer Expert dengan JavaScript"_, following **Clean Architecture**
and a test-driven workflow.

- **Runtime:** Node.js (ES modules)
- **HTTP:** Express 5
- **Database:** PostgreSQL (`pg`, `node-pg-migrate`)
- **Auth:** JWT access/refresh tokens (`jsonwebtoken`), passwords hashed with `bcrypt`
- **Validation:** Joi (request body) + domain entities (business rules)
- **DI:** `instances-container`
- **Tests:** Jest + Supertest

## Architecture

The codebase is split into the four Clean Architecture layers. Dependencies only ever
point inward: `Interfaces → Applications → Domains`, with `Infrastructures` supplying
concrete implementations of the interfaces the inner layers declare.

```
src/
├── Domains/           # Entities + abstract repositories (no framework, no I/O)
│   ├── users/         #   RegisterUser, RegisteredUser, UserLogin, UserRepository
│   ├── authentications/
│   ├── threads/       #   AddThread, AddedThread, ThreadRepository
│   ├── comments/
│   └── replies/
├── Applications/      # Use cases (one class per business action) + security contracts
│   ├── use_case/      #   AddThreadUseCase, GetThreadUseCase, DeleteCommentUseCase, ...
│   └── security/      #   PasswordHash, AuthenticationTokenManager (abstract)
├── Infrastructures/   # Concrete implementations of the abstractions above
│   ├── repository/    #   *RepositoryPostgres
│   ├── security/      #   BcryptPasswordHash, JwtTokenManager
│   ├── database/      #   pg connection pool
│   ├── middleware/    #   authenticateToken, validateRequestBody, errorHandler
│   ├── http/          #   createServer (Express app assembly)
│   └── container.js   #   DI wiring: which class satisfies which interface
├── Interfaces/        # HTTP plugins: routes → handlers → use cases
│   └── http/api/{users,authentications,threads,comments,replies}
├── Commons/           # config, ClientError hierarchy, DomainErrorTranslator
└── app.js             # entry point
```

Unit tests live next to the code they cover in `_test/` folders. Table-seeding helpers
for integration tests live in `tests/`.

## Getting started

### Prerequisites

- Node.js 18+ (the test scripts rely on `--experimental-vm-modules`)
- PostgreSQL 12+ with a role that can create databases

### 1. Install

```bash
npm install
```

### 2. Configure environment

Two env files are read, selected by `NODE_ENV` in `src/Commons/config.js`:

| `NODE_ENV`                | File loaded  |
| ------------------------- | ------------ |
| `production`              | `.env`       |
| `development` and `test`  | `.test.env`  |

Both files use the same keys:

```dotenv
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi
PGPASSWORD=your-password
PGPORT=5432
# PGSSLMODE=no-verify   # only needed for a managed/remote instance

# TOKENIZE
ACCESS_TOKEN_KEY=<random hex string>
REFRESH_TOKEN_KEY=<random hex string>
ACCESS_TOKEN_AGE=3000
```

Generate the token keys with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

The server binds to `localhost` unless `NODE_ENV=production`, in which case it binds
`0.0.0.0`.

### 3. Create the databases and run migrations

The `Makefile` wraps the usual local Postgres chores (it assumes a `developer` role on
`localhost`):

```bash
make create-db        # createdb forumapi
make create-db-test   # createdb forumapitest

npm run migrate up        # migrate the dev/prod database (.env)
npm run migrate:test up   # migrate the test database (.test.env)
```

Other Makefile targets: `psql`, `drop-db`, `drop-db-test`, `reset-db-migrate`,
`reset-db-migrate-test` (drop + create + migrate in one step).

For a remote Postgres that needs a relaxed TLS check, `migrate-with-ssl.mjs` runs the
same migrations with `rejectUnauthorized: false`:

```bash
node migrate-with-ssl.mjs up     # or: down
```

### 4. Run

```bash
npm run start:dev   # nodemon, NODE_ENV=development
npm start           # NODE_ENV=production
```

## Scripts

| Command                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm start`             | Start the server with `NODE_ENV=production`             |
| `npm run start:dev`     | Start with nodemon and `NODE_ENV=development`           |
| `npm test`              | Run the full Jest suite serially (`-i`)                 |
| `npm run test:watch`    | Jest in watch mode                                      |
| `npm run test:coverage` | Jest with a coverage report in `coverage/`              |
| `npm run migrate`       | `node-pg-migrate` against `.env`                        |
| `npm run migrate:test`  | `node-pg-migrate` against `.test.env` (sslmode relaxed) |
| `npm run lint`          | ESLint over the repo                                    |
| `npm run format`        | Prettier (`npm run format -- <path>`)                   |

## Testing

Unit, integration (repositories against real Postgres), and HTTP/functional tests all
run under Jest. Tests are run serially because they share one test database and truncate
tables between cases via `tests/DatabaseTestHelper.js`.

```bash
npm run migrate:test up   # make sure the test schema exists first
npm test
```

Open `coverage/index.html` after `npm run test:coverage` for the line-by-line report.

## Data model

| Table             | Columns                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `users`           | `id` (uuid PK), `username` (unique, ≤50), `password`, `fullname`            |
| `authentications` | `token` (unique index) — the whitelist of valid refresh tokens              |
| `threads`         | `id`, `title`, `body`, `user_id` → users, `created_at`                      |
| `comments`        | `id`, `content`, `is_deleted`, `user_id`, `thread_id` → threads, `created_at` |
| `replies`         | `id`, `content`, `is_deleted`, `user_id`, `comment_id` → comments, `created_at` |

Primary keys are UUIDv7, generated in the application layer (`uuidv7`), so rows sort
chronologically by id. Comment and reply deletion is **soft** — `is_deleted` is flipped
and the content is masked on read as `**komentar telah dihapus**` /
`**balasan telah dihapus**`.

## API

All responses are JSON and carry a `status` field: `success`, `fail` (4xx), or `error`
(5xx). Endpoints marked 🔒 require `Authorization: Bearer <accessToken>`.

### Users

**`POST /users`** — register.

```json
{ "username": "dicoding", "password": "secret", "fullname": "Dicoding Indonesia" }
```

`201` → `{ "status": "success", "data": { "addedUser": { "id", "username", "fullname" } } }`

Username must be ≤50 characters and match `^\w+$`; duplicates are rejected.

### Authentications

**`POST /authentications`** — log in.

```json
{ "username": "dicoding", "password": "secret" }
```

`201` → `{ "data": { "accessToken", "refreshToken" } }`

**`PUT /authentications`** — exchange a refresh token for a new access token.

```json
{ "refreshToken": "..." }
```

`200` → `{ "data": { "accessToken" } }`

**`DELETE /authentications`** — log out (removes the refresh token from the whitelist).

```json
{ "refreshToken": "..." }
```

### Threads

**`POST /threads`** 🔒

```json
{ "title": "sebuah thread", "body": "isi thread" }
```

`201` → `{ "data": { "addedThread": { "id", "title", "owner" } } }`

**`GET /threads`** — list all threads with a `total_discussion` count (comments + replies).

`200` → `{ "data": { "threads": [ { "id", "title", "body", "date", "username", "total_discussion" } ] } }`

**`GET /threads/{threadId}`** — thread detail with nested comments and replies.

```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "...", "title": "...", "body": "...", "date": "...", "username": "dicoding",
      "comments": [
        {
          "id": "...", "content": "...", "date": "...", "username": "johndoe",
          "replies": [{ "id": "...", "content": "...", "date": "...", "username": "dicoding" }]
        }
      ]
    }
  }
}
```

### Comments

**`POST /threads/{threadId}/comments`** 🔒 — body `{ "content": "..." }`
→ `201` `{ "data": { "addedComment": { "id", "content", "owner" } } }`

**`DELETE /threads/{threadId}/comments/{commentId}`** 🔒 — owner only, soft delete.

### Replies

**`POST /threads/{threadId}/comments/{commentId}/replies`** 🔒 — body `{ "content": "..." }`
→ `201` `{ "data": { "addedReply": { "id", "content", "owner" } } }`

**`DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}`** 🔒 — owner only,
soft delete.

### Error handling

`Infrastructures/middleware/errorHandler.js` is the single exit point for errors. Joi
validation failures and domain errors (thrown as `ENTITY.SOME_RULE` strings) are mapped
to user-facing Indonesian messages by `Commons/exceptions/DomainErrorTranslator`, then
answered with the status code carried by the matching `ClientError` subclass:

| Error class           | Status |
| --------------------- | ------ |
| `InvariantError`      | 400    |
| `AuthenticationError` | 401    |
| `AuthorizationError`  | 403    |
| `NotFoundError`       | 404    |
| unhandled / `ServerError` | 500 |

A malformed UUID in a path parameter (Postgres error `22P02`) is reported as `404`.
Unknown routes return `404` with `"Route not found"`.

## Deployment notes

The app is deployed to an EC2 instance fronted by an RDS Postgres database. `make ssh-ec2`
opens a shell on the instance using the `forum-api.pem` key in the repo root. Set
`NODE_ENV=production` there so the server binds `0.0.0.0` and reads `.env`.

## Security

Do not commit real credentials. `.env` is gitignored, but `.test.env`, `forum-api.pem`,
and the hardcoded connection string in the `psql-rds` Makefile target are not — rotate
anything that has already been shared and keep secrets out of version control.
