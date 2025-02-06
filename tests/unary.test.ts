// create tests for unary serve and client from server/unary.ts and client/unary.ts 
import { PaymentCreateRequest, PaymentCreateClient, PaymentCreateResponse, Status } from '../proto';
import { paymentCreate, paymentSave } from '../server/unary';

describe('unary', () => {
    // it.skip('paymentCreate', async () => {
    //     const request = new PaymentCreateRequest()
    //         .setAmountDetails(new PaymentCreateRequest.AmountDetails()
    //             .setAmount(100)
    //             .setCurrency('USD'))
    //         .setPayerId('payer')
    //         .setPayeeId('payee');

    //     const response = await paymentCreate(request);
    //     expect(response.getStatus()).toBe(Status.RECEIVED);
    //     expect(response.getReceivedAmount()).toBe(100);
    // });

    it.only('paymentSave', async () => {
        const request = new PaymentCreateRequest()
            .setAmountDetails(new PaymentCreateRequest.AmountDetails()
                .setAmount(100)
                .setCurrency('USD'))
            .setPayerId('payer')
            .setPayeeId('payee');

        const client = new PaymentCreateClient('localhost:50051', null, null);
        const response = await client.paymentCreate(request);
        expect(response.getStatus()).toBe(Status.RECEIVED);
        expect(response.getReceivedAmount()).toBe(100);

        const response2 = await paymentSave(request);
        expect(response2.getStatus()).toBe(Status.RECEIVED);
        expect(response2.getReceivedAmount()).toBe(100);
    });

    // it.skip('paymentCreate cancelled', async () => {
    //     const request = new PaymentCreateRequest()
    //         .setAmountDetails(new PaymentCreateRequest.AmountDetails()
    //             .setAmount(100)
    //             .setCurrency('USD'))
    //         .setPayerId('payer')
    //         .setPayeeId('payee');

    //     const client = new PaymentCreateClient('localhost:50051', null, null);
    //     const response = await client.paymentCreate(request);
    //     expect(response.getStatus()).toBe(Status.RECEIVED);
    //     expect(response.getReceivedAmount()).toBe(100);

    //     client.cancel();
    //     const response2 = await paymentSave(request);
    //     expect(response2.getStatus()).toBe(Status.RECEIVED);
    //     expect(response2.getReceivedAmount()).toBe(100);
    // });
});