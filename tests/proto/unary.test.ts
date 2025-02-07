mport * as grpc from '@grpc/grpc-js';
import { startGrpcServer, stopGrpcServer, readTlsCertificates } from '../../server';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';

import { PaymentServiceClient, TransactionCommitRequest, Amount } from '../../grpc/proto';

let client: PaymentServiceClient;
let paymentCreateAsync: (request: TransactionCommitRequest) => Promise<any>;
let mongoClient: MongoClient;

describe('gRPC unary server with MongoDB', () => {
    beforeAll(async () => {
        await startGrpcServer();

        const options = {
            checkServerIdentity: (a: any, b: any): any => undefined
        }
        const certificates: { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } = readTlsCertificates();

        const credentials: grpc.ChannelCredentials = certificates.rootCert ?
            grpc.ChannelCredentials.createSsl(certificates.rootCert, null, null, options) :
            grpc.ChannelCredentials.createInsecure();

        client = new PaymentServiceClient('localhost:50051', credentials, {
            'grpc.ssl_target_name_override': 'localhost',
            'grpc.default_authority': 'localhost',
        })

        paymentCreateAsync = promisify(client.paymentCreate).bind(client);

        mongoClient = new MongoClient(MONGO_URI);
        await mongoClient.connect();
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


        // @ts-ignore
        const response = await paymentCreateAsync(successfulRequest);
        expect(response.getStatus()).toBe(0);
        expect(response.getReason()).toBe(0);
        expect(response.getReceivedAmount()).toBe(1);
    });
});
