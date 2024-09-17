import { ServerReadableStream } from '@grpc/grpc-js';
import { PaymentCreateRequest, PaymentCreateResponse, Status } from '../proto'
const payeesInSystem = [1];

export async function orderPaymentCreate(call: ServerReadableStream<PaymentCreateRequest, PaymentCreateResponse>, callback: any) {
    let aggregatePayments: PaymentCreateRequest.AsObject[] = [];
    let receivedAmount = 0;
    call.on('data', (request: PaymentCreateRequest) => {
        console.log(`Payment with amount '${request.getAmountDetails()?.getAmount()}' arrived`);
        const payeeId: PaymentCreateRequest.AsObject["payeeId"] = request.getPayeeId();

        if (!payeesInSystem.includes(payeeId)) {
            console.log(`Unknown payee: ${payeeId}, payment with amount ${request.getAmountDetails()?.getAmount()} not accepted`);
        } else {
            receivedAmount += request.getAmountDetails()?.getAmount() as number;
            aggregatePayments.push({
                payeeId: request.getPayeeId(),
                payerId: request.getPayerId(),
                amountDetails: {
                    amount: request.getAmountDetails()?.getAmount() as number,
                    currency: request.getAmountDetails()?.getCurrency() as string
                }
            })
        }
    })

    call.on('end', () => {
        const response = new PaymentCreateResponse();
        if (aggregatePayments.length > 0) {

            response.setStatus(Status.RECEIVED);
            response.setReceivedAmount(receivedAmount);
        } else {
            response.setStatus(Status.REJECTED);
        }

        callback(null, response);
    })
}