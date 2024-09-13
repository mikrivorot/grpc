import * as grpc from '@grpc/grpc-js';
import { PaymentServiceClient, BulkPaymentCreateRequest, BulkPaymentCreateResponse, Status } from '../proto'

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);
    createBulkPayments(client);
}

async function createBulkPayments(client: PaymentServiceClient) {
    const call: grpc.ClientWritableStream<BulkPaymentCreateRequest> = client.bulkPaymentCreate(callbackFunction);

    const bulkPayments: BulkPaymentCreateRequest.AsObject[] = [{
        payerId: 1,
        payeeId: 1,
        amount: 10,
    }, {
        payerId: 1,
        payeeId: 1,
        amount: 20,
    }, {
        payerId: 2,
        payeeId: 1,
        amount: 10,
    }
    ];

    for (const payment of bulkPayments) {
        const bulkPaymentRequest: BulkPaymentCreateRequest = new BulkPaymentCreateRequest();
        bulkPaymentRequest
            .setAmount(payment.amount)
            .setPayeeId(payment.payeeId)
            .setPayerId(payment.payerId);
        call.write(bulkPaymentRequest);
    }
    call.end();
}

function callbackFunction(error: grpc.ServiceError | null, response: BulkPaymentCreateResponse) {
    if (error) {
        console.log(error);
    } else {
        const status = getKeyFromEnumByValue({ receivedValue: response.getStatus(), e: Status });
        console.log(status);
    }
}

function getKeyFromEnumByValue({ receivedValue, e }: { receivedValue: number, e: any }) {
    for (let key in e) {
        let value = e[key];
        if (+value === receivedValue) return key;
    }
}

main();
