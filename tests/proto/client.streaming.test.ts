import * as grpc from '@grpc/grpc-js';
import { getGrpcClient, getChannelCredentials, readTlsCertificates } from '../utils';
import { TransactionCommitRequest, TransactionsCommitResponse, TransactionsClient, Amount, Status } from '../../grpc/proto/index';
import { startGrpcServer, stopGrpcServer } from '../../grpc/server';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../grpc/server/constants';

let client: TransactionsClient;

/*
 * Test cases for client streaming
 * NOTE: Assertion is done in callback, but if there is an error there or callback function is not called, 
 * test fails due to timeout (done() is not called)
 */

describe('TransactionsCommit Client Streaming Tests', () => {
    beforeAll(async () => {
        await startGrpcServer();
        const clientCredentials = getChannelCredentials(readTlsCertificates());
        client = await getGrpcClient(clientCredentials);
    });

    afterAll(async () => {
        client.close();
        await stopGrpcServer();
    });

    it('should successfully commit transactions with valid data', (done) => {
        // 1. Prepare mock data
        const receivedTransactions: TransactionCommitRequest[] = [
            new TransactionCommitRequest().setAmountDetails(new Amount().setAmount(10).setCurrency('EUR')).setUserId(1),
            new TransactionCommitRequest().setAmountDetails(new Amount().setAmount(20).setCurrency('EUR')).setUserId(2)
        ];
        const refusedTransactions: TransactionCommitRequest[] = [
            new TransactionCommitRequest().setAmountDetails(new Amount().setAmount(MIN_AMOUNT).setCurrency('EUR')).setUserId(1),
        ]
        const mockCallbackFunctionForClientStreaming = jest.fn((error, response) => {
            // 3. Assert test results
            expect(error).toBeNull();
            expect(response).toBeInstanceOf(TransactionsCommitResponse);
            expect(response.getStatus()).toEqual(Status.COMMITTED);
            expect(response.getTotalReceivedAmount()).toEqual(receivedTransactions.reduce((acc, curr: TransactionCommitRequest) => {
                return acc + (curr?.getAmountDetails()?.getAmount() || 0)
            }, 0));
            expect(response.getTotalRefusedCount()).toEqual(refusedTransactions.length);
            expect(response.getTotalReceivedCount()).toEqual(receivedTransactions.length);
            done();
        });
        const stream: grpc.ClientWritableStream<TransactionCommitRequest> =
            client.transactionsCommit(mockCallbackFunctionForClientStreaming);

        // 2. Start test execution
        for (const transaction of [...receivedTransactions, ...refusedTransactions]) {
            stream.write(transaction);
        }
        stream.end();
    });

    it('should handle errors from server', (done) => {
        // 1. Prepare mock data
        const refusedTransactions: TransactionCommitRequest[] = [
            new TransactionCommitRequest().setAmountDetails(new Amount().setAmount(MIN_AMOUNT).setCurrency('EUR')).setUserId(1),
            new TransactionCommitRequest().setAmountDetails(new Amount().setAmount(MAX_AMOUNT).setCurrency('EUR')).setUserId(1)
        ]
        const mockCallbackFunctionForClientStreaming = jest.fn((error, response) => {
            // 3. Assert test results
            expect(response).toBeInstanceOf(TransactionsCommitResponse);
            expect(response.getStatus()).toEqual(Status.REFUSED);
            expect(response.getTotalReceivedAmount()).toEqual(0);
            expect(response.getTotalReceivedCount()).toEqual(0);
            expect(response.getTotalRefusedCount()).toEqual(refusedTransactions.length);
            expect(error).toBeNull();
            done()
        });
        const stream: grpc.ClientWritableStream<TransactionCommitRequest> =
            client.transactionsCommit(mockCallbackFunctionForClientStreaming);

        // 2. Start test execution
        for (const transaction of refusedTransactions) {
            stream.write(transaction);
        }
        stream.end();
    });
});