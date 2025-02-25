import grpc
# from google.protobuf.empty_pb2 import Empty <- later add for nicer comments mapping
from build_py import main_pb2_grpc, transactions_pb2
from .dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO, TransactionsCommitResponseDTO
from .mapper.transaction_mapper import TransactionMapper
from typing import List
from dotenv import load_dotenv
import os

class GRPCClient:
    def __init__(self):
        self.channel = None
        self.stub = None
        self.mapper = TransactionMapper()
        self.setup_connection()
        
    def setup_connection(self):
        load_dotenv()
        
        root_certificates = open(f'{os.getenv("ROOT_CERTIFICATE_PATH")}', 'rb').read()
        private_key = open(f'{os.getenv("SERVER_PRIVATE_KEY_PATH")}', 'rb').read()
        certificate_chain = open(f'{os.getenv("SERVER_CERTIFICATE_PATH")}', 'rb').read()
        credentials = grpc.ssl_channel_credentials(
            root_certificates=root_certificates,
            private_key=private_key,
            certificate_chain=certificate_chain
        )
        
        address = os.getenv("GRPC_SERVER_ADDRESS")
        
        self.channel = grpc.secure_channel(f'{address}', credentials)
        self.stub = main_pb2_grpc.TransactionsStub(self.channel)
        
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