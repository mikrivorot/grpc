import * as  grpc from '@grpc/grpc-js';
import { PaymentServiceClient } from '../proto/index';
import { createSuccessfulPayment, createFailedPayment, deadline } from './unary';
import { createFailedPaymentWithStep, createSuccessfulPaymentWithStep } from './server.streaming';
import { orderPaymentCreate } from './client.streaming';
import { bulkPaymentCreate } from './bidirectional';

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);

    // unary
    createSuccessfulPayment(client);
    createFailedPayment(client);
    deadline(client);

    // server streaming
    createFailedPaymentWithStep(client);
    createSuccessfulPaymentWithStep(client);

    // client streaming
    orderPaymentCreate(client);

    // bi-direction
    bulkPaymentCreate(client)
}
main();
