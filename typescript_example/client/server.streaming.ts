import { PaymentCreateRequest, PaymentCreateResponse, PaymentServiceClient, Status, RejectReasons } from '../proto';
import { getPreparedPaymentAmountDetails, getKeyFromEnumByValue } from './utils';
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

export async function createSuccessfulPaymentWithStep(client: PaymentServiceClient) {
    const successfulPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
    successfulPaymentRequest
        .setPayeeId(1)
        .setPayerId(10)
        .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 1, currency: 'EUR' }));

    const successfulCall = client.paymentCreateWithSteps(successfulPaymentRequest);
    successfulCall.on('data', (res: PaymentCreateResponse) => {
        const status = getKeyFromEnumByValue({ receivedValue: res.getStatus(), e: Status });
        const reason = getKeyFromEnumByValue({ receivedValue: res.getReason(), e: RejectReasons });
        const comment = res.getCommentList()?.join('. ');
        console.log(`${comment} (${status}/${reason})`);
    });
}

export async function createFailedPaymentWithStep(client: PaymentServiceClient) {
    const failedPaymentRequest: PaymentCreateRequest = new PaymentCreateRequest();
    failedPaymentRequest
        .setPayeeId(2)
        .setPayerId(20)
        .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 200, currency: 'EUR' }));

    const failedCall = client.paymentCreateWithSteps(failedPaymentRequest);
    failedCall.on('data', (res: PaymentCreateResponse) => {
        const status = getKeyFromEnumByValue({ receivedValue: res.getStatus(), e: Status });
        const reason = getKeyFromEnumByValue({ receivedValue: res.getReason(), e: RejectReasons });
        const comment = res.getCommentList()?.join('. ');
        console.log(`${comment} (${status}/${reason})`);
    });
}

export async function paymentsList(client: PaymentServiceClient) {
    const call = client.paymentsList(new Empty());
    call.on('data', (res: PaymentCreateResponse) => {
        const comment = res.getCommentList()?.join('. ');
        console.log(`Received "${comment}" for ${res.getId()} `);
    });
    call.on('end', (_1: any, _2: any) => {
        console.log('Finished');
    });
}