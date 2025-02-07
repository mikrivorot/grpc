# main.py
from fastapi import FastAPI, HTTPException
import grpc
from your_grpc_module import TransactionsStub, CreatePaymentRequest  # Replace with actual imports
import os

app = FastAPI()

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

def get_grpc_client():
    # Setup gRPC channel and client
    address = os.getenv('GRPC_CLIENT_ADDRESS', 'localhost:50051')
    creds = grpc.ssl_channel_credentials() if use_tls() else grpc.insecure_channel()
    channel = grpc.secure_channel(address, creds) if use_tls() else grpc.insecure_channel(address)
    
    client = TransactionsStub(channel)
    return client

def use_tls():
    # Determine if TLS should be used (implement logic here as needed)
    return False

async def create_successful_payment(client):
    # Create and send a gRPC request
    request = CreatePaymentRequest()  # Adjust request fields accordingly
    try:
        response = client.create_successful_payment(request)
        return response
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"gRPC error: {e.details()}")

@app.post("/api/createSuccessfulPayment")
async def create_payment_endpoint():
    client = get_grpc_client()
    result = await create_successful_payment(client)
    return {"success": True, "result": result}

# Run using: uvicorn main:app --reload