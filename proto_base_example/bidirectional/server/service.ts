import { ServerUnaryCall, ServerWritableStream, UntypedServiceImplementation, ServerDuplexStream, handleBidiStreamingCall } from '@grpc/grpc-js';
import { BulkPaymentCreateRequest, BulkPaymentCreateResponse, Status } from '../proto'
import { v4 as uuidv4 } from 'uuid';
const payeesInSystem = [1];

export const Service = {
    bulkPaymentCreate: (call: ServerDuplexStream<BulkPaymentCreateRequest, BulkPaymentCreateResponse>) => {
        call.on('data', (request: BulkPaymentCreateRequest) => {
            console.log(`Payment amount = ${request.getAmount()} for payee id ${request.getPayeeId()}`);
            if (payeesInSystem.includes(request.getPayeeId())) {
                const successfulResponse = new BulkPaymentCreateResponse().setPaymentId(uuidv4()).setStatus(Status.RECEIVED);
                call.write(successfulResponse)
            } else {
                const failedResponse = new BulkPaymentCreateResponse().setPaymentId('N/A').setStatus(Status.REJECTED);
                call.write(failedResponse);
            }
        })

        call.on('end', () => call.end());
    }
}