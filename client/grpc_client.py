import grpc
# from google.protobuf.empty_pb2 import Empty <- later add for comments
from build_py import main_pb2_grpc, transactions_pb2
from .dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO, TransactionsCommitResponseDTO
from .mapper.transaction_mapper import TransactionMapper
from typing import Iterator, List

class GRPCClient:
    def __init__(self, host='localhost', port=50051): #todo params
        root_certificates = open('certificates/ca.crt', 'rb').read()
        private_key = open('certificates/server.pem', 'rb').read()
        certificate_chain = open('certificates/server.crt', 'rb').read()
        credentials = grpc.ssl_channel_credentials(
            root_certificates=root_certificates,
            private_key=private_key,
            certificate_chain=certificate_chain
        )
        
        self.channel = grpc.secure_channel('localhost:50051', credentials)
        self.stub = main_pb2_grpc.TransactionsStub(self.channel)
        self.mapper = TransactionMapper()
    
    def transaction_commit(
        self, 
        transaction_data: TransactionCommitRequestDTO
    ) -> TransactionCommitResponseDTO:
        grpc_request: transactions_pb2.TransactionCommitRequest = self.mapper.to_unary_request(transaction_data)
        
        grpc_response: transactions_pb2.TransactionCommitResponse = self.stub.TransactionCommit(grpc_request)
        
        return self.mapper.from_unary_response(grpc_response)
    
    def transaction_commit_with_steps(
        self, 
        transaction_data: TransactionCommitRequestDTO
    ) -> List[TransactionCommitResponseDTO]:
        grpc_request: transactions_pb2.TransactionCommitRequest = self.mapper.to_unary_request(transaction_data)
        
        grpc_response: transactions_pb2.TransactionCommitResponse = self.stub.TransactionCommitWithSteps(grpc_request)
        
        return self.mapper.from_server_streaming_response(grpc_response)
    
    
    def transactions_commit(
        self,
        transactions: List[TransactionCommitRequestDTO]
    ) -> TransactionsCommitResponseDTO:
        grpc_response: transactions_pb2.TransactionsCommitResponse = self.stub.TransactionsCommit(
            self.mapper.to_client_streaming_request(transactions)
        )
        
        return self.mapper.from_client_streaming_response(grpc_response)

    def transactions_with_steps_commit(
        self,
        transactions: List[TransactionCommitRequestDTO]
    ) -> List[TransactionCommitResponseDTO]:
        grpc_request: List[transactions_pb2.TransactionCommitRequest] = self.mapper.to_bidirectional_request(transactions)
        grpc_response: List[transactions_pb2.TransactionCommitResponse] = self.stub.BulkTransactionsCommit(
            grpc_request
        )
        
        return self.mapper.from_bidirectional_response(grpc_response)