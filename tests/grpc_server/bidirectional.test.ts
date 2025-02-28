
import * as grpc from '@grpc/grpc-js';
import { getGrpcClient, getChannelCredentials, readTlsCertificates } from './utils';
import { TransactionCommitRequest, TransactionCommitResponse, TransactionsClient, Amount, Status, RejectReasons } from '../../server/proto';
import { startGrpcServer, stopGrpcServer } from '../../server/server';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../server/constants';

let client: TransactionsClient;

/**
 * Test cases for bidirectional streaming
 */
describe('gRPC Bidirectional Streaming Tests', () => {
    beforeAll(async () => {
        await startGrpcServer();
        const clientCredentials = getChannelCredentials(readTlsCertificates());
        client = await getGrpcClient(clientCredentials);
    });

    afterAll(async () => {
        client.close();
        await stopGrpcServer();
    });

    it('should successfully commit and refuse transactions based on provided data', (done) => {
        // 1. Prepare mock data
        const transactionsRaw = [
            { amount: 10, currency: 'EUR', userId: 1 },
            { amount: 20, currency: 'EUR', userId: 2 },
            { amount: MIN_AMOUNT, currency: 'EUR', userId: 3 }
        ];

        const transactionsForRequest: TransactionCommitRequest[] = []

        for (const t of transactionsRaw) {
            transactionsForRequest.push(new TransactionCommitRequest()
                .setAmountDetails(new Amount()
                    .setAmount(t.amount)
                    .setCurrency(t.currency))
                .setUserId(t.userId))
        }

        const mockCallbackFunctionForBidirectionalStreaming = jest.fn((response: TransactionCommitResponse) => {
            // 3. Validate
            expect(response).toBeInstanceOf(TransactionCommitResponse);
        });

        const stream: grpc.ClientDuplexStream<TransactionCommitRequest, TransactionCommitResponse> =
            client.bulkTransactionsCommit();
        stream.on('data', mockCallbackFunctionForBidirectionalStreaming)

        // 2. Start test execution
        for (const transaction of transactionsForRequest) {
            stream.write(transaction);
        }
        stream.end();


        // 3. Validate
        stream.on('end', () => {

            // Order of call can be random
            expect(mockCallbackFunctionForBidirectionalStreaming).toHaveBeenCalledTimes(transactionsRaw.length);
            const responsesFromServer: [response: TransactionCommitResponse][] = mockCallbackFunctionForBidirectionalStreaming.mock.calls;

            const committedResponseFromServer = responsesFromServer.find(([call]: [TransactionCommitResponse]) => call.getReceivedAmount() === transactionsForRequest[0].getAmountDetails()?.getAmount())
            const refusedResponseFromServer = responsesFromServer.find(([call]: [TransactionCommitResponse]) => call.getReceivedAmount() === transactionsForRequest[2].getAmountDetails()?.getAmount())

            expect(committedResponseFromServer).toBeDefined();
            expect(refusedResponseFromServer).toBeDefined()

            done();

        });
    });
});