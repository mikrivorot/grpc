import { ServerDuplexStream } from '@grpc/grpc-js';
import { TransactionCommitRequest, TransactionCommitResponse, Status, RejectReasons } from './proto'
import { MIN_AMOUNT, MAX_AMOUNT } from './constants';

export function bulkTransactionsCommit(call: ServerDuplexStream<TransactionCommitRequest, TransactionCommitResponse>): void {
    call.on('data', (request: TransactionCommitRequest) => {
        const receivedAmount: number | undefined = request.getAmountDetails()?.getAmount();
        const currency: string | undefined = request.getAmountDetails()?.getCurrency();

        switch (receivedAmount) {
            case MAX_AMOUNT:
            case MIN_AMOUNT:
            case undefined:
                const failedResponse: TransactionCommitResponse = new TransactionCommitResponse()
                    .setStatus(Status.REFUSED)
                    .setReceivedAmount(receivedAmount as number)
                    .setReason(RejectReasons.INVALID_ARGUMENT)
                    .setCommentList([`Received amount ${receivedAmount} ${currency} is out of range (${MIN_AMOUNT} -> ${MAX_AMOUNT}`, 'Transaction refused']);

                call.write(failedResponse)
                break;
            default:
                const successfulResponse: TransactionCommitResponse = new TransactionCommitResponse()
                    .setStatus(Status.COMMITTED)
                    .setReceivedAmount(receivedAmount as number)
                    .setCommentList([`Received amount ${receivedAmount} ${currency} is accepted`]);

                call.write(successfulResponse);
                break;
        }

    })
    call.on('end', () => {
        call.end()
    });
}
