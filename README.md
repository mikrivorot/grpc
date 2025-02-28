# gRPC Communication Example
A demonstration of gRPC communication patterns between Python client and Node.js server with SSL/TLS security.

## API Interaction
Users can trigger gRPC communications through these REST endpoints exposed by FastAPI:

1. **Single Transaction** (`POST /transaction/commit`)
   - Regular mode: Single request/response **->** triggers unary gRPC call
   - With steps mode: query pareameter `with_steps=true` for detailed transaction steps **->** trigger server-streaming gRPC call

2. **Bulk Transactions** (`POST /transaction/commit/bulk`)
   - Regular mode: Processes multiple transactions **->** trigger client-streaming gRPC call
   - Per-request mode: `?response_per_request=true` for individual transaction responses **->** trigger bidirectional gRPC call

![alt text](image.png)


## Architecture Diagram

```mermaid
graph TB
    subgraph Clients["External Clients"]
        REST["REST API Users"]
    end

    subgraph FastAPI["FastAPI Application"]
        FA_Routes["Transaction Routes"]
        FA_DTOs["DTOs/Models"]
        C_SSL["SSL/TLS Setup"]
        C_Unary["Unary Client"]
        C_Server["Server Streaming Client"]
        C_Client["Client Streaming"]
        C_Bidir["Bidirectional Streaming"]
    end

    subgraph Server["Node.js gRPC Server"]
        S_SSL["SSL/TLS Handler"]
        S_Unary["TransactionCommit"]
        S_Server["TransactionCommitWithSteps"]
        S_Client["TransactionsCommit"]
        S_Bidir["BulkTransactionsCommit"]
    end

    REST -->|"HTTP POST /transaction/commit"| FA_Routes
    REST -->|"HTTP POST /transaction/commit/bulk"| FA_Routes
    
    FA_Routes --> FA_DTOs
    FA_DTOs --> C_Unary
    FA_DTOs --> C_Server
    FA_DTOs --> C_Client
    FA_DTOs --> C_Bidir

    C_SSL -->|"SSL Certificates"| S_SSL
    
    C_Unary -->|"Single Request"| S_Unary
    S_Unary -->|"Single Response"| C_Unary
    
    C_Server -->|"Single Request"| S_Server
    S_Server -->|"Stream of Responses"| C_Server
    
    C_Client -->|"Stream of Requests"| S_Client
    S_Client -->|"Single Response"| C_Client
    
    C_Bidir -->|"Stream of Requests"| S_Bidir
    S_Bidir -->|"Stream of Responses"| C_Bidir

    style Clients fill:#f9f3ff,stroke:#333,stroke-width:2px
    style FastAPI fill:#e6f3ff,stroke:#333,stroke-width:2px
    style Server fill:#f9f9f9,stroke:#333,stroke-width:2px

```


## Overview
This project demonstrates different gRPC communication patterns:

- Unary RPC (single request/response)

- Server Streaming (one request, multiple responses)

- Client Streaming (multiple requests, one response)

- Bidirectional Streaming (multiple requests and responses)


## Project Structure
- [server/](server/) - Node.js gRPC server written on TypeScript

- [client/](client/) - gRPC client written on Python with FastAPI to have REST API endpoints exposed

- [proto/](proto/) - Protobuf definitions split into two files

- [docs/](docs/) - Documentation files

- [tests/](tests/) - Tests for both gRPC server and client

- [openapi.json](openapi.json) - OpenAPI schema for FastAPI

- [Makefile](Makefile) - Makefile for building and running the project

#### Folders and files not included in Git (auto-generated or should be added manually)
- *certificates* - SSL/TLS certificates for testing purposes (self-signed and excluded from Git)
- *build_ts* - TypeScript generated files
- *build_py* - Python generated files
- *.env* - Environment variables for local development
- *.venv* - Virtual environment for local development
- *node_modules* - Node.js dependencies


## Prerequisites

Node.js (v14+), Python (v3.8+), UV package manager, Make

## Getting Started

### Server Setup (TypeScript)

```bash
# Install dependencies
npm i

# Generate TypeScript proto files
npm run generate:proto:ts

# Start the server
npm run start:server

# Run server tests
npm run test:server
```

### Client Setup (Python)
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
uv pip install .

# Generate Python proto files
make generate

# Start the client
make start
# or
npm run start:client

# Run client tests
make test-client
# or
npm run test:client
```

## Security
The communication is secured using SSL/TLS certificates. See [Faced Problems](./docs/faced_problems.md) for details about certificate generation and configuration.

## Additional Documentation
- [UV Tool Usage](./docs/uv.md) - Tiny guide for using the UV package manager

- [Troubleshooting](./docs/faced_problems.md) - Faced issues and applied solutions

- [Sequence Diagrams](./docs/sequence_diagram.md) - Another way to render gRPC client<->server communication (via Sequence Diagram)

- [VSCode configs](./.vscode/launch.json) - Some debug configurations for VSCode I used for debugging

## Further steps
- [.github/workflows.yaml](.github/workflows.yaml) - Github Actions workflow for CI/CD
- observability