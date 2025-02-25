import { ServerUnaryCall, status } from '@grpc/grpc-js';
import { TransactionCommitRequest, TransactionCommitResponse, Status, RejectReasons } from '../proto';
import { MIN_AMOUNT, MAX_AMOUNT } from './constants';

export async function transactionCommit(call: ServerUnaryCall<TransactionCommitRequest, TransactionCommitResponse>, callback: any) {
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;
    if (!['EUR'].includes(currency)) {
        callback({
            code: status.INVALID_ARGUMENT,
            message: `Currency is not allowed, received ${amount} ${currency}`
        });
    } else if (amount <= MIN_AMOUNT) {
        const response = new TransactionCommitResponse()
            .setStatus(Status.REFUSED)
            .setReason(RejectReasons.INVALID_ARGUMENT)
            .setReceivedAmount(amount);
        callback(null, response);
    } else if (amount > MAX_AMOUNT) {
        const response = new TransactionCommitResponse()
            .setStatus(Status.REFUSED)
            .setReason(RejectReasons.INVALID_ARGUMENT)
            .setReceivedAmount(amount);
        callback(null, response);
    } else {
        const response = new TransactionCommitResponse()
            .setStatus(Status.COMMITTED)
            .setReceivedAmount(amount)
            .setCommentList(['Transaction was successfully committed'])
        callback(null, response);
    }
}