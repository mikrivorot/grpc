import { ServerUnaryCall, status, ServerWritableStream } from '@grpc/grpc-js';
import { PaymentCreateRequest, PaymentCreateResponse, Status, RejectReasons } from '../proto/index';

function callBank(ms: number) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) }

export async function paymentCreate(call: ServerUnaryCall<PaymentCreateRequest, PaymentCreateResponse>, callback: any) {
    console.log('Payment Create was involved');
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;
    if (amount < 0) {
        callback({
            code: status.INVALID_ARGUMENT,
            message: `Amount cannot be negative, received ${amount} ${currency}`
        });
    } else if (amount > 100) {
        await callBank(2000);
        if (call.cancelled) {
            console.log('Call was cancelled by client');
            // revert transaction
        } else {
            // but if I try to send response on cancelled call?
            const response = new PaymentCreateResponse()
                .setStatus(Status.RECEIVED)
                .setReceivedAmount(amount);
            callback(null, response);
        }
    } else {
        await callBank(2000);
        if (call.cancelled) {
            console.log('Call was cancelled by client');
            // revert transaction
        } else {
            // but if I try to send response on cancelled call?
            const response = new PaymentCreateResponse()
                .setStatus(Status.RECEIVED)
                .setReceivedAmount(amount);
            callback(null, response);
        }
    }
}