import * as grpc from '@grpc/grpc-js';
import { PaymentServiceClient, BulkPaymentCreateRequest, BulkPaymentCreateResponse, Status } from '../proto'

async function main() {
    const credentials: grpc.ChannelCredentials = grpc.ChannelCredentials.createInsecure();
    const client: PaymentServiceClient = new PaymentServiceClient('localhost:3001', credentials);
    createBulkPayments(client);
}



function getKeyFromEnumByValue({ receivedValue, e }: { receivedValue: number, e: any }) {
    for (let key in e) {
        let value = e[key];
        if (+value === receivedValue) return key;
    }
}

main();
