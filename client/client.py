# grpc_client.py - Dedicated gRPC client class

import grpc
from google.protobuf.empty_pb2 import Empty
import main_pb2_grpc
import transactions_pb2
import transactions_pb2_grpc

class GRPCClient:
    def __init__(self, host='localhost', port=50051):
        # Create a channel to the gRPC server
        self.channel = grpc.insecure_channel(f'{host}:{port}')
        self.stub = TransactionsStub(self.channel)
    
    def transaction_commit(self, transaction_data):
        request = TransactionCommitRequest(**transaction_data)
        return self.stub.TransactionCommit(request)
    
    def transaction_commit_with_steps(self, transaction_data):
        request = TransactionCommitRequest(**transaction_data)
        return self.stub.TransactionCommitWithSteps(request)
    
    def transactions_list(self):
        response_iterator = self.stub.TransactionsList(Empty())
        return [response for response in response_iterator]
    
    def transactions_commit(self, requests):
        request_iterator = (TransactionCommitRequest(**data) for data in requests)
        return self.stub.TransactionsCommit(request_iterator)
    
    def bulk_transactions_commit(self, requests):
        request_iterator = (TransactionCommitRequest(**data) for data in requests)
        return self.stub.BulkTransactionsCommit(request_iterator)