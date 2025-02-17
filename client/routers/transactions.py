from fastapi import APIRouter, HTTPException, Body
import grpc
from ..grpc_client import GRPCClient
from ..dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO
from ..model.response_models import APIResponse

router = APIRouter(
    prefix="/transaction",
    tags=["Transactions"]
)

grpc_client = GRPCClient(host='localhost', port=50051)

@router.post("/commit", 
    response_model= APIResponse[TransactionCommitResponseDTO],
    summary="Commit a transaction",
    description="Commits a transaction with the provided details",
    status_code=201
)
async def transaction_commit(
    transaction: TransactionCommitRequestDTO = Body(
        ...,
        description="Transaction details to commit"
    )
) -> APIResponse[TransactionCommitResponseDTO]:
    try:
        response = grpc_client.transaction_commit(transaction)
        return APIResponse[TransactionCommitResponseDTO](
            response = response,
            statusCode = 201
        ).model_dump()
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))