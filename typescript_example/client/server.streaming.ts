import { PaymentCreateRequest, PaymentCreateResponse, PaymentServiceClient, Status, RejectReasons } from '../proto/index';
import { getPreparedPaymentAmountDetails, getKeyFromEnumByValue } from './utils';

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