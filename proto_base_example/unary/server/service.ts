import { ServerUnaryCall, status } from '@grpc/grpc-js';
import pb from '../build/payment_pb';

function callBank(ms: number) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) }

export default async function paymentCreate(call: ServerUnaryCall<pb.PaymentCreateRequest, pb.PaymentCreateResponse>, callback: any) {
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
            const response = new pb.PaymentCreateResponse()
                .setStatus(`Hello, ${call.request.getCustomerId()}`)
                .setSum(amount);
            callback(null, response);
        }
    } else {
        await callBank(2000);
        if (call.cancelled) {
            console.log('Call was cancelled by client');
            // revert transaction
        } else {
            // but if I try to send response on cancelled call?
            const response = new pb.PaymentCreateResponse()
                .setStatus(`Hello, ${call.request.getCustomerId()}`)
                .setSum(amount);
            callback(null, response);
        }
    }
}