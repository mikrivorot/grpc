from build_py import transactions_pb2
from ..dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO, \
    TransactionsCommitResponseDTO, TransactionsRefusedResponseDTO
from typing import List, Iterator

# NOTE: gRPC streaming APIs always provide iterators/generators, not lists. 
# The lists only come into play if you choose to collect all the responses into a list yourself. 

class TransactionMapper:
    # unary
    @staticmethod
    def to_unary_request(dto: TransactionCommitRequestDTO) -> transactions_pb2.TransactionCommitRequest:
        amount_details: transactions_pb2.Amount = transactions_pb2.Amount(
            amount=int(dto.amount),
            currency=dto.currency,
        )
                
        return transactions_pb2.TransactionCommitRequest(
            amount_details=amount_details,
            user_id=int(dto.user_id)
        )
        
    @staticmethod
    def from_unary_response(response: transactions_pb2.TransactionCommitResponse) -> TransactionCommitResponseDTO:
        return TransactionCommitResponseDTO(
            status=transactions_pb2.Status.Name(response.status),
            message=[c for c in response.comment]
        )
    
    # server streaming
    @staticmethod
    def from_server_streaming_response(responses: Iterator[transactions_pb2.TransactionCommitResponse]) -> Iterator[TransactionCommitResponseDTO]:
        def response_generator():
            for response in responses:
                yield TransactionMapper.from_unary_response(response)
                
        return response_generator();
    
    # bidirectional
    @staticmethod
    def to_bidirectional_request(dtos: List[TransactionCommitRequestDTO]) -> Iterator[transactions_pb2.TransactionCommitRequest]:
        return TransactionMapper.to_client_streaming_request(dtos)
    
    @staticmethod
    def from_bidirectional_response(
        responses: Iterator[transactions_pb2.TransactionCommitResponse]
    ) -> Iterator[TransactionCommitResponseDTO]:
        def response_generator():
            for response in responses:
                yield TransactionMapper.from_unary_response(response)
        return response_generator()

    # client streaming
    @staticmethod
    def to_client_streaming_request(dtos: List[TransactionCommitRequestDTO]) -> Iterator[transactions_pb2.TransactionCommitRequest]:
        def response_generator():
            for dto in dtos:
                yield TransactionMapper.to_unary_request(dto)
                
        return response_generator();
    
    @staticmethod
    def from_client_streaming_response(
        response: transactions_pb2.TransactionsCommitResponse
    ) -> TransactionsCommitResponseDTO | TransactionsRefusedResponseDTO:
        if response.status == transactions_pb2.Status.REFUSED:
            return TransactionsRefusedResponseDTO(
                refused_transactions=response.total_refused_count,
                status=transactions_pb2.Status.Name(response.status),
                message=["Transaction refused", "see count of refused transactions in `refused_transactions` property"]
            )
        else:
            return TransactionsCommitResponseDTO(
                transferred_amount=response.total_received_amount,
                refused_transactions=response.total_refused_count,
                status=transactions_pb2.Status.Name(response.status),
                message=["Transaction committed", "see count of refused transactions in `refused_transactions` property"]
            )