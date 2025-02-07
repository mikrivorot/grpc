import { ServerWritableStream, status } from '@grpc/grpc-js';
import { TransactionCommitRequest, TransactionCommitResponse, Status, RejectReasons } from '../proto';
// import { connect } from './db';
// import { Collection } from 'mongodb';
import { MAX_AMOUNT, MIN_AMOUNT } from './constants';

export async function transactionCommitWithSteps(call: ServerWritableStream<TransactionCommitRequest, TransactionCommitResponse>) {
    const receivedAmount: number | undefined = call.request.getAmountDetails()?.getAmount();
    const currency: string | undefined = call.request.getAmountDetails()?.getCurrency();

    if (currency && !['EUR'].includes(currency)) {
        call.destroy({
            name: 'INVALID_ARGUMENT',
            message: `Currency is not allowed, received ${receivedAmount} ${currency}`
        });
        call.end();
        return;
    }

    const initialResponse: TransactionCommitResponse = new TransactionCommitResponse()
        .setStatus(Status.PROCESSING)
        .setReceivedAmount(receivedAmount as number)
        .setCommentList(['Transaction started']);

    call.write(initialResponse);

    const processingResponse: TransactionCommitResponse = new TransactionCommitResponse()
        .setStatus(Status.PROCESSING)
        .setReceivedAmount(receivedAmount as number)
        .setCommentList(['Transaction in process']);

    call.write(processingResponse);

    switch (receivedAmount) {
        case MAX_AMOUNT:
            const refusedMaxAmount: TransactionCommitResponse = new TransactionCommitResponse()
                .setStatus(Status.REFUSED)
                .setReceivedAmount(receivedAmount as number)
                .setReason(RejectReasons.INVALID_ARGUMENT)
                .setCommentList([`Received amount ${receivedAmount} $ is higher than ${MAX_AMOUNT}`, 'Transaction refused']);
            call.write(refusedMaxAmount);
            break;
        case MIN_AMOUNT:
            const refusedMinAmount: TransactionCommitResponse = new TransactionCommitResponse()
                .setStatus(Status.REFUSED)
                .setReceivedAmount(receivedAmount as number)
                .setReason(RejectReasons.INVALID_ARGUMENT)
                .setCommentList([`Received amount ${receivedAmount} $ is lower than ${MIN_AMOUNT}`, 'Transaction refused']);
            call.write(refusedMinAmount);
            break;
        default:
            const finishedResponse: TransactionCommitResponse = new TransactionCommitResponse()
                .setStatus(Status.COMMITTED)
                .setReceivedAmount(receivedAmount as number)
                .setCommentList([`Received amount ${receivedAmount} accepted`]);
            call.write(finishedResponse);
            break;
    }
    call.end();
}


// export async function paymentsList(call: ServerWritableStream<PaymentCreateRequest, PaymentCreateResponse>) {
//     console.log('Payment List was involved');
//     try {
//         const connection = await connect();
//         const database = connection.db('payments');

//         const collection = database.collection('payments') as Collection;

//         const documents = await collection.find().toArray();

//         for (const document of documents) {
//             const response = new PaymentCreateResponse()
//                 .setId(document._id.toString())
//                 .setCommentList(['Retrieved from DB']);
//             call.write(response as PaymentCreateResponse);
//         }
//         call.end();
//     } catch {
//         call.destroy({
//             name: 'error',
//             message: 'error'
//         });
//     }
// }
