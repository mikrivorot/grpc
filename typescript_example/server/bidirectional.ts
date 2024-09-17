import { ServerDuplexStream } from '@grpc/grpc-js';
import { PaymentCreateRequest, PaymentCreateResponse, Status } from '../proto'
import { v4 as uuidv4 } from 'uuid';
const payeesInSystem = [1];

export function bulkPaymentCreate(call: ServerDuplexStream<PaymentCreateRequest, PaymentCreateResponse>) {
    call.on('data', (request: PaymentCreateRequest) => {
        console.log(`Payment amount = ${request.getAmountDetails()?.getAmount()} for payee id ${request.getPayeeId()}`);
        if (payeesInSystem.includes(request.getPayeeId())) {
            const successfulResponse = new PaymentCreateResponse().setId(uuidv4()).setStatus(Status.RECEIVED);
            call.write(successfulResponse)
        } else {
            const failedResponse = new PaymentCreateResponse().setId('N/A').setStatus(Status.REJECTED).setCommentList([`Payee ${request.getPayeeId()} not found in system`]);
            call.write(failedResponse);
        }
    })

    call.on('end', () => call.end());
}