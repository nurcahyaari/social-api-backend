# Boo — Server

Simple Express + Mongoose server for profiles and posts.

## Requirements
- Node.js (14+)
- npm

## Install
```sh
npm install
```

## Run (development)
Start the server:
```sh
node server.js
```
Server defaults to port 3000 (or set PORT env var). When run, it will connect to MongoDB (use MONGODB_URI for a real DB).

## Tests
Integration tests use Mocha + Supertest and mongodb-memory-server (in-memory DB).

Run all tests:
```sh
npm test
```

Run a single test file with timeout:
```sh
npx mocha test/integration.test.js --timeout 10000
```

Notes
- Tests are isolated and use an in-memory MongoDB instance.
- Seed data is available via `seeder.js` when the server starts.