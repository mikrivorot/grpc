import { ServerReadableStream } from '@grpc/grpc-js';
import { BulkPaymentCreateRequest, PaymentCreateResponse, Status } from '../proto'
const payeesInSystem = [1];
export const Service = {
    bulkPaymentCreate: async (call: ServerReadableStream<BulkPaymentCreateRequest, PaymentCreateResponse>, callback: any) => {
        let aggregatePayments: BulkPaymentCreateRequest.AsObject[] = [];
        call.on('data', (request: BulkPaymentCreateRequest) => {
            console.log(`Payment with amount '${request.getAmount()}' received`);
            const payeeId: BulkPaymentCreateRequest.AsObject["payeeId"] = request.getPayeeId();

            if (!payeesInSystem.includes(payeeId)) {
                console.log(`Unknown payee: ${payeeId}`);
            } else {
                aggregatePayments.push({
                    payeeId: request.getPayeeId(),
                    payerId: request.getPayerId(),
                    amount: request.getAmount()
                })
            }
        })

        call.on('end', () => {
            const response = new PaymentCreateResponse();
            if (aggregatePayments.length > 0) {
                response.setStatus(Status.RECEIVED);
            } else {
                response.setStatus(Status.REJECTED);
            }

            callback(null, response);
        })
    }
}