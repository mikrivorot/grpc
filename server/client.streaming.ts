import { ServerReadableStream } from '@grpc/grpc-js';
import { TransactionCommitRequest, TransactionsCommitResponse, Status } from './proto'
import { MAX_AMOUNT, MIN_AMOUNT } from './constants';

export async function transactionsCommit(call: ServerReadableStream<TransactionCommitRequest, TransactionsCommitResponse>, callback: any) {
    const receivedTransactions: TransactionCommitRequest.AsObject[] = [];
    const refusedTransactions: TransactionCommitRequest.AsObject[] = [];
    call.on('data', (request: TransactionCommitRequest) => {
        const amount: number = request.getAmountDetails()?.getAmount() as number;
        if (amount === MAX_AMOUNT || amount === MIN_AMOUNT) {
            refusedTransactions.push({
                userId: request.getUserId(),
                amountDetails: {
                    amount: request.getAmountDetails()?.getAmount() as number,
                    currency: request.getAmountDetails()?.getCurrency() as string
                }
            })
        } else {
            receivedTransactions.push({
                userId: request.getUserId(),
                amountDetails: {
                    amount: request.getAmountDetails()?.getAmount() as number,
                    currency: request.getAmountDetails()?.getCurrency() as string
                }
            })
        }
    })

    call.on('end', () => {
        const response = new TransactionsCommitResponse();
        if (receivedTransactions.length > 0) {
            response.setStatus(Status.COMMITTED);
            response.setTotalReceivedAmount(receivedTransactions.reduce((acc, curr: TransactionCommitRequest.AsObject) => {
                return acc + (curr?.amountDetails?.amount || 0)
            }, 0));
            response.setTotalReceivedCount(receivedTransactions.length);
            response.setTotalRefusedCount(refusedTransactions.length);
        } else {
            response.setStatus(Status.REFUSED);
            response.setTotalReceivedAmount(0);
            response.setTotalReceivedCount(0);
            response.setTotalRefusedCount(refusedTransactions.length);
        }

        callback(null, response);
    })
}