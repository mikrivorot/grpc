import { handleServerStreamingCall, ServerReadableStream, ServerWritableStream } from '@grpc/grpc-js';
import { Status, PaymentCreateResponse, PaymentCreateRequest, RejectReasons } from '../build/payment_pb';

export const Service = {
    paymentCreateWithStatus: async (call: ServerWritableStream<PaymentCreateRequest, PaymentCreateResponse>) => {
        console.log('Payment Creation was involved');
        const receivedAmount: number = call.request.getAmountDetails()?.getAmount() || 0;
        /**
         * asynchronously call bank and initiate a payment
         */
        const initialResponse: PaymentCreateResponse = new PaymentCreateResponse()
            .setStatus(Status.RECEIVED)
            .setReceivedAmount(receivedAmount)
            .setCommentList(['Bank contacted', 'Transaction started']);

        call.write(initialResponse);

        const processingResponse: PaymentCreateResponse = new PaymentCreateResponse()
            .setStatus(Status.PROCESSING)
            .setReceivedAmount(call.request.getAmountDetails()?.getAmount() as number)
            .setCommentList(['Payment in process']);

        call.write(processingResponse);

        if (receivedAmount > 10) {
            const rejectedResponse: PaymentCreateResponse = new PaymentCreateResponse()
                .setStatus(Status.REJECTED)
                .setReceivedAmount(call.request.getAmountDetails()?.getAmount() as number)
                .setReason(RejectReasons.INSUFFICIENT_FUNDS)
                .setCommentList([`Received amount ${receivedAmount} $ is higher than 10$`, 'Payment rejected by bank']);
            call.write(rejectedResponse);
        } else {
            const finishedResponse: PaymentCreateResponse = new PaymentCreateResponse()
                .setStatus(Status.FINISHED)
                .setReceivedAmount(call.request.getAmountDetails()?.getAmount() as number)
                .setCommentList([`Received amount ${receivedAmount} accepted`]);
            call.write(finishedResponse);
        }

        call.end();
    }
}