import { ServerUnaryCall, status, ServerWritableStream } from '@grpc/grpc-js';
import { PaymentCreateRequest, PaymentCreateResponse, Status } from '../proto';
import { connect } from './db';
import { Collection, Filter, ObjectId } from 'mongodb';


function callBank(ms: number) { return new Promise((resolve, reject) => setTimeout(resolve, ms)) }

export async function paymentCreate(call: ServerUnaryCall<PaymentCreateRequest, PaymentCreateResponse>, callback: any) {
    console.log('Payment Create was involved');
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;
    if (amount < 0) {
        callback({
            code: status.INVALID_ARGUMENT,
            message: `Amount cannot be negative, received ${amount} ${currency}`
        });
    } else if (amount > 100) {
        await callBank(2000);
        if (call.cancelled) {
            console.log('Call was cancelled by client');
            // revert transaction
        } else {
            // but if I try to send response on cancelled call?
            const response = new PaymentCreateResponse()
                .setStatus(Status.RECEIVED)
                .setReceivedAmount(amount);
            callback(null, response);
        }
    } else {
        await callBank(2000);
        if (call.cancelled) {
            console.log('Call was cancelled by client');
            // revert transaction
        } else {
            // but if I try to send response on cancelled call?
            const response = new PaymentCreateResponse()
                .setStatus(Status.RECEIVED)
                .setReceivedAmount(amount);
            callback(null, response);
        }
    }
}

export async function paymentSave(call: ServerUnaryCall<PaymentCreateRequest, PaymentCreateResponse>, callback: any) {
    console.log('Payment Save was involved');
    const amount = call.request.getAmountDetails()?.getAmount() as number;
    const currency = call.request.getAmountDetails()?.getCurrency() as string;

    try {
        const connection = await connect();
        const database = connection.db('payments');

        const collection = database.collection('payments') as Collection;

        // block with basic Mongo Collection operations
        const inserted = await collection.insertOne({
            amount,
            currency
        });
        let uuid = inserted.insertedId.toString();

        // I skipped types creation for Documents
        const founded = await collection.findOne({ _id: new ObjectId(uuid) });
        if (!founded || !founded._id) {
            throw new Error('find');
        }

        uuid = founded._id.toString();

        const updated = await collection.updateOne({ _id: new ObjectId(uuid) } as Filter<any>, {
            $set: {
                payer_id: call.request.getPayerId(),
                payee_id: call.request.getPayeeId(),
            }
        })

        if (!updated || !updated.acknowledged || !updated.modifiedCount) {
            throw new Error('update');
        }

        const response = new PaymentCreateResponse()
            .setStatus(Status.RECEIVED)
            .setId(uuid)
            .setCommentList(['Payment was successfully saved'])
            .setReceivedAmount(amount);

        callback(null, response);
    } catch (e) {
        const x = e;
        callback({
            code: status.INTERNAL,
            message: `Cannot ${['save', 'find', 'update'].includes(e as string) || 'proceed with'} payment in DB`
        }, null);
    }
}