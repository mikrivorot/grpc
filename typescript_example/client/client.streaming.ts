import { PaymentCreateRequest, PaymentCreateResponse, PaymentServiceClient, Status, RejectReasons } from '../proto';
import { getPreparedPaymentAmountDetails, getKeyFromEnumByValue } from './utils';
import * as  grpc from '@grpc/grpc-js';

export async function orderPaymentCreate(client: PaymentServiceClient) {
    console.log("'orderPaymentCreate' was involved");

    const call: grpc.ClientWritableStream<PaymentCreateRequest> = client.orderPaymentCreate(callbackFunction);

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
    }
    ];

    for (const payment of bulkPayments) {
        const bulkPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
        bulkPaymentRequest
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: payment.amountDetails?.amount as number, currency: payment.amountDetails?.currency as string }))
            .setPayeeId(payment.payeeId)
            .setPayerId(payment.payerId);
        call.write(bulkPaymentRequest);
    }
    call.end();
}

function callbackFunction(error: grpc.ServiceError | null, response: PaymentCreateResponse) {
    if (error) {
        console.log(error);
    } else {
        const status = getKeyFromEnumByValue({ receivedValue: response.getStatus(), e: Status });
        const amount = response.getReceivedAmount();
        console.log(`Status: ${status}, amount: ${amount}`);
    }
}
