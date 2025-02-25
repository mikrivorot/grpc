# gRPC Communication Patterns

This diagram illustrates the interaction patterns between our gRPC client and server.

```mermaid
sequenceDiagram
    participant Client as Python gRPC Client
    participant Server as Node.js gRPC Server

    Note over Client,Server: SSL/TLS Setup
    Client->>Server: Initialize secure connection with SSL certificates

    rect rgb(200, 220, 240)
        Note over Client,Server: Unary RPC
        Client->>Server: TransactionCommit(TransactionCommitRequest)
        Server-->>Client: TransactionCommitResponse
    end

    rect rgb(220, 240, 200)
        Note over Client,Server: Server Streaming RPC
        Client->>Server: TransactionCommitWithSteps(TransactionCommitRequest)
        loop Multiple Responses
            Server-->>Client: Stream of TransactionCommitResponse
        end
    end

    rect rgb(240, 220, 200)
        Note over Client,Server: Client Streaming RPC
        loop Multiple Requests
            Client->>Server: Stream of TransactionCommitRequest
        end
        Server-->>Client: TransactionsCommitResponse
    end

    rect rgb(220, 200, 240)
        Note over Client,Server: Bidirectional Streaming RPC
        loop Multiple Requests/Responses
            Client->>Server: Stream of TransactionCommitRequest
            Server-->>Client: Stream of TransactionCommitResponse
        end
    end
```