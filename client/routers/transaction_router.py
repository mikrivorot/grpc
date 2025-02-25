from fastapi import APIRouter, HTTPException, Body, Query, Depends
import grpc
from ..grpc_client import GRPCClient
from ..dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO, TransactionsCommitResponseDTO
from ..model.response_models import APIResponse
from typing import List, Union

router = APIRouter(
    prefix="/transaction",
    tags=["Transactions"]
)

def get_grpc_client():
    client = GRPCClient()
    try:
        yield client
    finally:
        if client.channel:
            client.channel.close()
            
# unary + server streaming
@router.post("/commit", 
    response_model= APIResponse[Union[TransactionCommitResponseDTO, List[TransactionCommitResponseDTO]]],
    summary="Commit a transaction",
    description="Commits a transaction with the provided details. If the amount is higher than 100 or lower than 10, the transaction will be refused",
    status_code=201
)
async def transaction_commit(
    with_steps: bool = Query(
        False,
        description="If true, returns response with execution steps"
    ),
    transaction: TransactionCommitRequestDTO = Body(
        ...,
        description="Transaction details to commit"
    ),
    grpc_client: GRPCClient = Depends(get_grpc_client)
) -> APIResponse[Union[TransactionCommitResponseDTO, List[TransactionCommitResponseDTO]]]:
    try:
        if with_steps:
            responses: List[TransactionCommitResponseDTO] = grpc_client.transaction_commit_with_steps(transaction)
            return APIResponse[List[TransactionCommitResponseDTO]](
                response = responses,
                statusCode = 201
            ).model_dump()
        else:
            response: TransactionCommitResponseDTO = grpc_client.transaction_commit(transaction)
            return APIResponse[TransactionCommitResponseDTO](
                response = response,
                statusCode = 201
            ).model_dump()

    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# client streaming + bidirectional
@router.post("/commit/bulk", 
    response_model= APIResponse[Union[TransactionsCommitResponseDTO, List[TransactionCommitResponseDTO]]],
    summary="Commit multiple transactions",
    description="Commits multiple transactions in a single request. If the amount is higher than 100 or lower than 10, the transaction will be refused. If `response_per_request` is true, response will be returned per transaction in request",
    status_code=201
)
async def transactions_commit(
    response_per_request: bool = Query(
        False,
        description="If true, response wil be returned per transaction in request"
    ),
    transactions: List[TransactionCommitRequestDTO] = Body(
        ...,
        description="Array of transactions to commit"
    ),
    grpc_client: GRPCClient = Depends(get_grpc_client)
) -> APIResponse[Union[TransactionsCommitResponseDTO, List[TransactionCommitResponseDTO]]]:
    try:
        if response_per_request:
            response = grpc_client.transactions_with_steps_commit(transactions)
            return APIResponse[List[TransactionCommitResponseDTO]](
                response=response,
                statusCode=201
            ).model_dump()
        else:
            response = grpc_client.transactions_commit(transactions)
            return APIResponse[TransactionsCommitResponseDTO](
                response=response,
                statusCode=201
            ).model_dump()
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))