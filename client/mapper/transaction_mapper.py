from build_py import transactions_pb2
from ..dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO

class TransactionMapper:
    @staticmethod
    def to_grpc_request(dto: TransactionCommitRequestDTO) -> transactions_pb2.TransactionCommitRequest:
        amount_details: transactions_pb2.Amount = transactions_pb2.Amount(
            amount=int(dto.amount),
            currency=dto.currency,
        )
                
        return transactions_pb2.TransactionCommitRequest(
            amount_details=amount_details,
            user_id=int(dto.user_id)
        )
    
    @staticmethod
    def from_grpc_response(
        response: transactions_pb2.TransactionCommitResponse
    ) -> TransactionCommitResponseDTO:
        return TransactionCommitResponseDTO(
            status=transactions_pb2.Status.Name(response.status),
            message=[c for c in response.comment]
        )