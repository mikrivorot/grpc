import { startGrpcServer, stopGrpcServer } from '../../grpc/server';
import { getChannelCredentials, getGrpcClient, readTlsCertificates } from '../utils';
import { TransactionCommitResponse, TransactionCommitRequest, Amount, TransactionsClient, RejectReasons, Status } from '../../grpc/proto';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../grpc/server/constants';

let client: TransactionsClient;

describe('gRPC streaming server', () => {
    beforeAll(async () => {
        await startGrpcServer();
        const clientCredentials = getChannelCredentials(readTlsCertificates());
        client = await getGrpcClient(clientCredentials);
    });

    afterAll(async () => {
        client.close();
        await stopGrpcServer();
    });

    it('should handle streaming transaction commits', async () => {
        const request: TransactionCommitRequest = new TransactionCommitRequest();
        request.setUserId(1).setAmountDetails(new Amount().setAmount(10).setCurrency('EUR'));

        const stream = client.transactionCommitWithSteps(request);

        const responses: TransactionCommitResponse[] = await new Promise((resolve, reject) => {
            const responses: TransactionCommitResponse[] = [];
            stream.on('data', (response: TransactionCommitResponse) => {
                responses.push(response);
            });

            stream.on('end', () => {
                resolve(responses);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });

        expect(responses.length).toBeGreaterThan(0);
        expect(responses[0].getStatus()).toBe(Status.PROCESSING);
        expect(responses[responses.length - 1].getStatus()).toBe(Status.COMMITTED);
    }, 50000);

    it('should refuse transaction when amount equals MAX_AMOUNT', async () => {
        const request: TransactionCommitRequest = new TransactionCommitRequest();
        request.setUserId(1).setAmountDetails(new Amount().setAmount(MAX_AMOUNT).setCurrency('EUR'));

        const stream = client.transactionCommitWithSteps(request);

        const responses: TransactionCommitResponse[] = await new Promise((resolve, reject) => {
            const responses: TransactionCommitResponse[] = [];
            stream.on('data', (response: TransactionCommitResponse) => {
                responses.push(response);
            });

            stream.on('end', () => {
                resolve(responses);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });

        expect(responses.length).toBeGreaterThan(0);
        expect(responses[0].getStatus()).toBe(Status.PROCESSING);
        expect(responses[responses.length - 1].getStatus()).toBe(Status.REFUSED);
    }, 50000);

    it('should refuse transaction when amount equals MIN_AMOUNT', async () => {
        const request: TransactionCommitRequest = new TransactionCommitRequest();
        request.setUserId(1).setAmountDetails(new Amount().setAmount(MIN_AMOUNT).setCurrency('EUR'));

        const stream = client.transactionCommitWithSteps(request);

        const responses: TransactionCommitResponse[] = await new Promise((resolve, reject) => {
            const responses: TransactionCommitResponse[] = [];
            stream.on('data', (response: TransactionCommitResponse) => {
                responses.push(response);
            });

            stream.on('end', () => {
                resolve(responses);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });

        expect(responses.length).toBeGreaterThan(0);
        expect(responses[responses.length - 1].getStatus()).toBe(Status.REFUSED);
    }, 50000);
});