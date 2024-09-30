import { Amount, PaymentCreateResponse } from '../proto';
import * as  grpc from '@grpc/grpc-js';

export function getKeyFromEnumByValue({ receivedValue, e }: { receivedValue: number, e: any }) {
    for (let key in e) {
        let value = e[key];
        if (+value === receivedValue) return key;
    }
}

export function getPreparedPaymentAmountDetails({ amount, currency }: { amount: number, currency: string }): Amount {
    return new Amount()
        .setAmount(amount)
        .setCurrency(currency)
}

export function handleUnaryCallback(error: grpc.ServiceError | null, response: PaymentCreateResponse) {
    if (error) {
        console.log(`Error = ${error}`);
    } else {
        console.log(`Status is = ${response.getStatus()}`);
        console.log(`Sum is = ${response.getReceivedAmount()}`)
        if (response.getId()) {
            console.log(`Generated UUID is = ${response.getId()}`);
        }
    }
}