import * as  grpc from '@grpc/grpc-js';
import { PaymentServiceClient } from '../build/payment_grpc_pb';
import { Amount, PaymentCreateRequest, PaymentCreateResponse, Status, RejectReasons } from '../build/payment_pb';

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);

    createPaymentWithStatus(client);
    // client.close();
}

async function createPaymentWithStatus(client: PaymentServiceClient) {
    try {
        const successfulPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
        successfulPaymentRequest
            .setCustomerId('111')
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 1, currency: 'EUR' }));

        const successfulCall = client.paymentCreateWithStatus(successfulPaymentRequest);
        successfulCall.on('data', (res: PaymentCreateResponse) => {
            const status = getKeyFromEnumByValue({ receivedValue: res.getStatus(), e: Status });
            const reason = getKeyFromEnumByValue({ receivedValue: res.getReason(), e: RejectReasons });
            const comment = res.getCommentList()?.join('. ');
            console.log(`${comment} (${status}/${reason})`);
        });


        const failedPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
        failedPaymentRequest
            .setCustomerId('123')
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 200, currency: 'EUR' }));

        const failedCall = client.paymentCreateWithStatus(failedPaymentRequest);
        failedCall.on('data', (res: PaymentCreateResponse) => {
            const status = getKeyFromEnumByValue({ receivedValue: res.getStatus(), e: Status });
            const reason = getKeyFromEnumByValue({ receivedValue: res.getReason(), e: RejectReasons });
            const comment = res.getCommentList()?.join('. ');
            console.log(`${comment} (${status}/${reason})`);
        });
    } catch (e) {
        debugger;
    }
}
main();

function getKeyFromEnumByValue({ receivedValue, e }: { receivedValue: number, e: any }) {
    for (let key in e) {
        let value = e[key];
        if (+value === receivedValue) return key;
    }
}

function getPreparedPaymentAmountDetails({ amount, currency }: { amount: number, currency: string }): Amount {
    return new Amount()
        .setAmount(amount)
        .setCurrency(currency || 'EUR')
}