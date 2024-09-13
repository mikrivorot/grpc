import { ServerUnaryCall, UntypedServiceImplementation } from '@grpc/grpc-js';
import { BulkPaymentCreateRequest, BulkPaymentCreateResponse, Status } from '../proto'
const payeesInSystem = [1];
export const Service: UntypedServiceImplementation = {
    bulkPaymentCreate: async (call: ServerUnaryCall<BulkPaymentCreateRequest, BulkPaymentCreateResponse>, callback: any) => {
        let aggregatePayments: BulkPaymentCreateRequest.AsObject[] = [];
        call.on('data', (request: BulkPaymentCreateRequest) => {
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
            const response = new BulkPaymentCreateResponse();
            if (aggregatePayments.length > 0) {
                response.setStatus(Status.RECEIVED);
            } else {
                response.setStatus(Status.REJECTED);
            }

            callback(null, response);
        })
    }
}