import { ServerUnaryCall, status } from '@grpc/grpc-js';
import pb from '../build/payment_pb';

export default function paymentCreate(call: ServerUnaryCall<pb.PaymentCreateRequest, pb.PaymentCreateResponse>, callback: any) {
    console.log('Payment Create was involved');
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;
    if (amount < 0) {
        callback({
            code: status.INVALID_ARGUMENT,
            message: `Amount cannot be negative, received ${amount} ${currency}`
        });
    } else {
        const response = new pb.PaymentCreateResponse()
            .setStatus(`Hello, ${call.request.getCustomerId()}`)
            .setSum(amount);
        callback(null, response);
    }
}