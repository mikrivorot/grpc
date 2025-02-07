import { PaymentCreateRequest, PaymentCreateResponse, PaymentServiceClient, Status, RejectReasons } from '../proto';
import { getPreparedPaymentAmountDetails, getKeyFromEnumByValue } from './utils';
import * as  grpc from '@grpc/grpc-js';

export async function bulkPaymentCreate(client: PaymentServiceClient) {
    console.log("'bulkPaymentCreate' was involved");
    return new Promise((resolve, reject) => {

        const stream: grpc.ClientDuplexStream<PaymentCreateRequest, PaymentCreateResponse> = client.bulkPaymentCreate();

        const bulkPayments: PaymentCreateRequest.AsObject[] = [{
            payerId: 1,
            payeeId: 1,
            amountDetails: {
                amount: 10,
                currency: 'EUR'
            },
        }, {
            payerId: 1,
            payeeId: 1,
            amountDetails: {
                amount: 20,
                currency: 'EUR'
            },
        }, {
            payerId: 2,
            payeeId: 2,
            amountDetails: {
                amount: 10,
                currency: 'EUR'
            },
        }];

        for (const payment of bulkPayments) {
            const bulkPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
            bulkPaymentRequest
                .setAmountDetails(getPreparedPaymentAmountDetails(payment.amountDetails as { amount: number, currency: string }))
                .setPayeeId(payment.payeeId)
                .setPayerId(payment.payerId);
            stream.write(bulkPaymentRequest);
        }
        stream.on('data', (response: PaymentCreateResponse) => {
            console.log(`Payment with payment id ${response.getId()}, ${getKeyFromEnumByValue({ receivedValue: response.getStatus(), e: Status })}, comments: ${response.getCommentList()}`);
        })
        stream.on('error', function (e: any) {
            console.log(`Error received: ${e.message}`);
            reject();
        })

        // @ts-expect-error
        stream.end((): void => {
            // @ts-expect-error
            resolve();
        });
    });
}