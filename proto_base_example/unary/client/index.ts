import * as  grpc from '@grpc/grpc-js';
import { PaymentServiceClient } from '../build/payment_grpc_pb';
import { Amount, PaymentCreateRequest, PaymentCreateResponse } from '../build/payment_pb';

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);

    createPayment(client);
    // client.close();
}

async function createPayment(client: PaymentServiceClient) {
    try {
        const request: PaymentCreateRequest = new PaymentCreateRequest();
        request
            .setCustomerId('111')
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 1, currency: 'EUR' }));

        // client.paymentCreate(request, (error: grpc.ServiceError | null, response: PaymentCreateResponse) => {
        client.paymentCreate(request, (error: any, response: PaymentCreateResponse) => {
            if (error) {
                console.log(`Error = ${error}`);
            } else {
                console.log(`Status is = ${response.getStatus()}`);
                console.log(`Sum is = ${response.getSum()}`)
            }
        });
    } catch (e) {
        debugger;
    }
}

function getPreparedPaymentAmountDetails({ amount, currency }: { amount: number, currency: string }): Amount {
    return new Amount()
        .setAmount(1)
        .setCurrency('EUR')
}

main();