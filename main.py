import grpc
from fastapi import FastAPI, HTTPException
from .grpc.client.client import GRPCClient

app = FastAPI()
grpc_client = GRPCClient(host='localhost', port=50051)

@app.post("/transaction/commit")
async def transaction_commit(data: dict):
    try:
        response = grpc_client.transaction_commit(data)
        return {"response": response}
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transaction/list")
async def transactions_list():
    try:
        response_list = grpc_client.transactions_list()
        return {"responses": response_list}
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transaction/commit/with-steps")
async def transaction_commit_with_steps(data: dict):
    try:
        response_iterator = grpc_client.transaction_commit_with_steps(data)
        response_list = [response for response in response_iterator]
        return {"responses": response_list}
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transactions/commit/stream")
async def transactions_commit_stream(requests: list):
    try:
        response = grpc_client.transactions_commit(requests)
        return {"response": response}
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transactions/bulk-commit")
async def bulk_transactions_commit(requests: list):
    try:
        response_list = grpc_client.bulk_transactions_commit(requests)
        return {"responses": response_list}
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))