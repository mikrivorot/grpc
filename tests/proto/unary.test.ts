import { startGrpcServer, stopGrpcServer } from '../../grpc/server';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';
import { getChannelCredentials, getGrpcClient, readTlsCertificates } from '../utils';
import { TransactionCommitResponse, TransactionCommitRequest, Amount, TransactionsClient, RejectReasons, Status } from '../../grpc/proto';

let client: TransactionsClient;
let transactionCommitAsync: (request: TransactionCommitRequest) => Promise<unknown>;
let mongoClient: MongoClient;

describe('gRPC unary server', () => {
    beforeAll(async () => {
        await startGrpcServer();
        const clientCredentials = getChannelCredentials(readTlsCertificates());
        client = await getGrpcClient(clientCredentials);
        transactionCommitAsync = promisify(client.transactionCommit).bind(client);
    });

    afterAll(async () => {
        client.close();
        await stopGrpcServer();
    });

    it('should commit transaction', async () => {
        // 1. Prepare mock data
        const successfulRequest: TransactionCommitRequest = new TransactionCommitRequest()
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(1)
                .setCurrency('EUR'));

        // 2. Start test execution
        const response = await transactionCommitAsync(successfulRequest) as TransactionCommitResponse;

        // 
        expect(response.getStatus()).toBe(0);
        expect(response.getReason()).toBe(0);
        expect(response.getReceivedAmount()).toBe(1);
    });

    it('should fail to commit transaction with invalid currency', async () => {
        // 1. Prepare mock data
        const failedRequest: TransactionCommitRequest = new TransactionCommitRequest()
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(0)
                .setCurrency('EUR1'));

        // 2 and 3. Start test execution, assert test results
        await expect(transactionCommitAsync(failedRequest)).rejects.toThrowError('Currency is not allowed');
    });


    it('should fail to commit transaction with negative amount', async () => {
        // 1. Prepare mock data
        const failedRequest: TransactionCommitRequest = new TransactionCommitRequest()
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(-1)
                .setCurrency('EUR'));

        // 2. Start test execution
        const response = await transactionCommitAsync(failedRequest) as TransactionCommitResponse;

        // 3. Assert test results
        expect(response.getStatus()).toBe(Status.REFUSED);
        expect(response.getReason()).toBe(RejectReasons.INVALID_ARGUMENT);
        expect(response.getReceivedAmount()).toBe(-1);
    });
});
