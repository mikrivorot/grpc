import * as  grpc from '@grpc/grpc-js';
import { PaymentCreateRequest, PaymentServiceClient } from '../proto';
import { getPreparedPaymentAmountDetails, handleUnaryCallback } from './utils';

export async function createSuccessfulPayment(client: PaymentServiceClient, allowedTimeout = 1000) {
    console.log("'createSuccessfulPayment' was involved");
    return new Promise((resolve, reject) => {
        const successfulRequest: PaymentCreateRequest = new PaymentCreateRequest();
        successfulRequest
            .setPayeeId(1)
            .setPayerId(10)
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 1, currency: 'EUR' }));

        client.paymentCreate(successfulRequest, handleUnaryCallback({ resolve, reject }));
    });
}


export async function saveSuccessfulPayment(client: PaymentServiceClient, allowedTimeout = 1000) {
    console.log("'saveSuccessfulPayment' was involved");
    return new Promise((resolve, reject) => {
        const successfulRequest: PaymentCreateRequest = new PaymentCreateRequest();
        successfulRequest
            .setPayeeId(1)
            .setPayerId(10)
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 1, currency: 'EUR' }));

        client.paymentSave(successfulRequest, handleUnaryCallback({ resolve, reject }));
    });
}

export async function createFailedPayment(client: PaymentServiceClient, allowedTimeout = 1000) {
    console.log("'createFailedPayment' was involved");
    return new Promise((resolve, reject) => {
        const failedRequest: PaymentCreateRequest = new PaymentCreateRequest();
        failedRequest
            .setPayeeId(2)
            .setPayerId(20)
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: -9, currency: 'EUR' }));

        client.paymentCreate(failedRequest, handleUnaryCallback({ resolve, reject }));
    });
}

export async function deadline(client: PaymentServiceClient, allowedTimeout = 1000) {
    console.log("'deadline' was involved");
    return new Promise((resolve, reject) => {

        const timeoutRequest: PaymentCreateRequest = new PaymentCreateRequest();
        timeoutRequest
            .setPayeeId(3)
            .setPayerId(30)
            .setAmountDetails(getPreparedPaymentAmountDetails({ amount: 100000, currency: 'EUR' }));

        // @ts-expect-error: CallOptions not assignable to Metadata
        client.paymentCreate(timeoutRequest, {
            deadline: new Date(Date.now() + allowedTimeout)
        } as grpc.CallOptions, handleUnaryCallback({ resolve, reject }));
    });
}