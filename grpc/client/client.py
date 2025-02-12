# grpc_client.py - Dedicated gRPC client class

import grpc
from google.protobuf.empty_pb2 import Empty
from build_py import main_pb2_grpc, transactions_pb2

class GRPCClient:
    def __init__(self, host='localhost', port=50051):
        # Create a channel to the gRPC server
        self.channel = grpc.insecure_channel(f'{host}:{port}')
        self.stub = main_pb2_grpc.TransactionsStub(self.channel)
    
    def transaction_commit(self, transaction_data):
        request = transactions_pb2.TransactionCommitRequest(**transaction_data)
        return self.stub.TransactionCommit(request)
    
    def transaction_commit_with_steps(self, transaction_data):
        request = transactions_pb2.TransactionCommitRequest(**transaction_data)
        return self.stub.TransactionCommitWithSteps(request)
    
    def transactions_list(self):
        response_iterator = self.stub.TransactionsList(Empty())
        return [response for response in response_iterator]
    
    def transactions_commit(self, requests):
        request_iterator = (transactions_pb2.TransactionCommitRequest(**data) for data in requests)
        return self.stub.TransactionsCommit(request_iterator)
    
    def bulk_transactions_commit(self, requests):
        request_iterator = (transactions_pb2.TransactionCommitRequest(**data) for data in requests)
        return self.stub.BulkTransactionsCommit(request_iterator)