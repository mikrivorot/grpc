import { ServerUnaryCall } from '@grpc/grpc-js';
import pb from '../build/payment_pb';

export default function paymentCreate(call: ServerUnaryCall<pb.PaymentCreateRequest, pb.PaymentCreateResponse>, callback: any) {
    console.log('Payment Create was involved');
    const response = new pb.PaymentCreateResponse()
        .setStatus(`Hello, ${call.request.getCustomerId()}`)
        .setSum(call.request.getAmountDetails()?.getAmount() as number);
    ;

    callback(null, response);
}