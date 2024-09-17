import * as  grpc from '@grpc/grpc-js';
import { PaymentServiceClient } from '../proto/index';
import { createSuccessfulPayment, createFailedPayment, deadline } from './unary';
import { createFailedPaymentWithStep, createSuccessfulPaymentWithStep } from './server.streaming';
import { orderPaymentCreate } from './client.streaming';

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);

    // createSuccessfulPayment(client);
    // createFailedPayment(client);
    // deadline(client);
    // createFailedPaymentWithStep(client);
    // createSuccessfulPaymentWithStep(client);

    orderPaymentCreate(client);
}
main();
