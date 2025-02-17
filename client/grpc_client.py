import grpc
# from google.protobuf.empty_pb2 import Empty
from build_py import main_pb2_grpc, transactions_pb2
from .dto.transaction_dto import TransactionCommitRequestDTO, TransactionCommitResponseDTO
from .mapper.transaction_mapper import TransactionMapper

class GRPCClient:
    def __init__(self, host='localhost', port=50051):
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
        grpc_request: transactions_pb2.TransactionCommitRequest = self.mapper.to_grpc_request(transaction_data)
        
        grpc_response: transactions_pb2.TransactionCommitResponse = self.stub.TransactionCommit(grpc_request)
        
        return self.mapper.from_grpc_response(grpc_response)