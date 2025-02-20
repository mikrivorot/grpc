## This repo is under construction, so the following tasks are still pending:

- [DONE] Add tests for unary communication
- [DONE] Add tests for server streaming
- [DONE] Add tests for client streaming
- [DONE] Add tests for bidirectional streaming
- [DONE] Remove `client_old` folder
- [WIP] Add client methods using Fast API
    - [DONE]: client method(s) for TransactionCommit
    - [DONE]: client method(s) for TransactionCommitWithSteps (maybe a flag in headers?)
    - [DONE]: client method(s) for TransactionsCommit
    - [DONE]: client method(s) for BulkTransactionsCommit
- Add integration tests for whole project (involving both client and server)
- Remove Mongo DB usage (replace with assumptions like /** expect this to be done */)
- Add nice diagrams (using mermaide?)
- Finish with README.md files: (1) explain the purpose, (2) explain gRPC server, (3) explain gRPC client
- What is the purpose of `uvicorn`, `pydantic` in this project? Add explanation

---
### gRPC server
Writen on typescript with tests using jest, no DB (used to be Mongo, but removed to simplify implementation)

#### Prepare

```
npm i
npm run generate:proto:ts
```

#### Start gRPC server

```
npm run start:server
```

#### Run tests

```
npm run test:server
```

---

### gRPC client

Written using python + FastAPI

#### Prepare

```bash
source .venv/bin/activate
uv pip install .
make generate
```

#### Start gRPC client

```
make start
```

or 

```
npm run start:client
```

#### Run tests

```
TODO
```

---

### Other interesting inner docs:

[Here](./docs/uv.md) you can find UV tool base usage

[Here](./docs/faced_problems.md) you can see some faced problems e.g. certificates generationm gRPC versions conflict etc.
