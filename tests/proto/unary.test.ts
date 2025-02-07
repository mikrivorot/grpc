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
        const successfulRequest: TransactionCommitRequest = new TransactionCommitRequest();
        successfulRequest
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(1)
                .setCurrency('EUR'));

        const response = await transactionCommitAsync(successfulRequest) as TransactionCommitResponse;
        expect(response.getStatus()).toBe(0);
        expect(response.getReason()).toBe(0);
        expect(response.getReceivedAmount()).toBe(1);
    });

    it('should fail to commit transaction with invalid currency', async () => {
        const failedRequest: TransactionCommitRequest = new TransactionCommitRequest();
        failedRequest
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(0)
                .setCurrency('EUR1'));

        await expect(transactionCommitAsync(failedRequest)).rejects.toThrowError('Currency is not allowed');
    });


    it('should fail to commit transaction with negative amount', async () => {
        const failedRequest: TransactionCommitRequest = new TransactionCommitRequest();
        failedRequest
            .setUserId(1)
            .setAmountDetails(new Amount()
                .setAmount(-1)
                .setCurrency('EUR'));

        const response = await transactionCommitAsync(failedRequest) as TransactionCommitResponse;
        expect(response.getStatus()).toBe(Status.REFUSED);
        expect(response.getReason()).toBe(RejectReasons.INVALID_ARGUMENT);
        expect(response.getReceivedAmount()).toBe(-1);
    });
});
