import { ServerUnaryCall, status } from '@grpc/grpc-js';
import { TransactionCommitRequest, TransactionCommitResponse, Status, RejectReasons } from '../proto';

// function callThirdParty(ms: number) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) }

export async function transactionCommit(call: ServerUnaryCall<TransactionCommitRequest, TransactionCommitResponse>, callback: any) {
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;
    if (!['EUR'].includes(currency)) {
        callback({
            code: status.INVALID_ARGUMENT,
            message: `Currency is not allowed, received ${amount} ${currency}`
        });
    } else if (amount < 0) {
        const response = new TransactionCommitResponse()
            .setStatus(Status.REJECTED)
            .setReason(RejectReasons.INVALID_ARGUMENT)
            .setReceivedAmount(amount);
        callback(null, response);
    } else {
        const response = new TransactionCommitResponse()
            .setStatus(Status.COMMITTED)
            .setReceivedAmount(amount);
        callback(null, response);
    }
}

// export async function paymentSave(call: ServerUnaryCall<TransactionCommitRequest, TransactionCommitResponse>, callback: any) {
//     console.log('Payment Save was involved');
//     const amount = call.request.getAmountDetails()?.getAmount() as number;
//     const currency = call.request.getAmountDetails()?.getCurrency() as string;

//     try {
//         const connection = await connect();
//         const database = connection.db('payments');

//         const collection = database.collection('payments') as Collection;

//         // block with basic Mongo Collection operations
//         const inserted = await collection.insertOne({
//             amount,
//             currency
//         });
//         let uuid = inserted.insertedId.toString();

//         // I skipped types creation for Documents
//         const founded = await collection.findOne({ _id: new ObjectId(uuid) });
//         if (!founded || !founded._id) {
//             throw new Error('find');
//         }

//         uuid = founded._id.toString();

//         const updated = await collection.updateOne({ _id: new ObjectId(uuid) } as Filter<any>, {
//             $set: {
//                 payer_id: call.request.getPayerId(),
//                 payee_id: call.request.getPayeeId(),
//             }
//         })

//         if (!updated || !updated.acknowledged || !updated.modifiedCount) {
//             throw new Error('update');
//         }

//         const response = new TransactionCommitResponse()
//             .setStatus(Status.COMMITTED)
//             .setId(uuid)
//             .setCommentList(['Payment was successfully saved'])
//             .setReceivedAmount(amount);

//         callback(null, response);
//     } catch (e) {
//         const x = e;
//         callback({
//             code: status.INTERNAL,
//             message: `Cannot ${['save', 'find', 'update'].includes(e as string) || 'proceed with'} payment in DB`
//         }, null);
//     }
// }