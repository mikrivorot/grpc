 
import { startGrpcServer, stopGrpcServer } from '../../server';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';
import { getChannelCredentials, getGrpcClient } from '../utils';

import { PaymentServiceClient, TransactionCommitRequest, Amount } from '../../grpc/proto';

let client: PaymentServiceClient;
let paymentCreateAsync: (request: TransactionCommitRequest) => Promise<any>;
let mongoClient: MongoClient;

describe('gRPC unary server with MongoDB', () => {
    beforeAll(async () => {
        await startGrpcServer();
        const clientCredentials = getChannelCredentials();
        const client = await getGrpcClient(clientCredentials);

        paymentCreateAsync = promisify(client.paymentCreate).bind(client);
    });

    afterAll(async () => {
        client.close();
        await mongoClient.db(DB_NAME).collection(COLLECTION_NAME).deleteMany({}); // Clean up test data
        await mongoClient.close();
        await stopGrpcServer();
    });

    it('should create a payment', async () => {
        const successfulRequest: TransactionCommitRequest = new TransactionCommitRequest();
        successfulRequest
            .setPayeeId(1)
            .setPayerId(10)
            .setAmountDetails(new Amount()
                .setAmount(1)
                .setCurrency('EUR'));


        const response = await paymentCreateAsync(successfulRequest);
        expect(response.getStatus()).toBe(0);
        expect(response.getReason()).toBe(0);
        expect(response.getReceivedAmount()).toBe(1);
    });
});
