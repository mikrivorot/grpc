import * as  grpc from '@grpc/grpc-js';
import { PaymentServiceClient } from '../proto';
import { createSuccessfulPayment, createFailedPayment, deadline, saveSuccessfulPayment } from './unary';
import { createFailedPaymentWithStep, createSuccessfulPaymentWithStep, paymentsList } from './server.streaming';
import { orderPaymentCreate } from './client.streaming';
import { bulkPaymentCreate } from './bidirectional';
import fs from 'node:fs';
import path from 'path';

async function main() {

    const options = {
        checkServerIdentity: (a: any, b: any): any => undefined
    }
    const certificates: { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } = readTlsCertificates();

    const credentials: grpc.ChannelCredentials = certificates.rootCert ?
        grpc.ChannelCredentials.createSsl(certificates.rootCert, null, null, options) :
        grpc.ChannelCredentials.createInsecure();

    let client: PaymentServiceClient = new PaymentServiceClient('localhost:50051', credentials, {
        'grpc.ssl_target_name_override': 'localhost',
        'grpc.default_authority': 'localhost',
    })

    // unary calls reworked to async (Promises with callbacks/calls inside)
    await Promise.allSettled([
        createSuccessfulPayment(client),
        saveSuccessfulPayment(client),
        createFailedPayment(client),
        deadline(client)
    ]);

    // server streaming
    createFailedPaymentWithStep(client);
    createSuccessfulPaymentWithStep(client);
    paymentsList(client);

    // client streaming
    orderPaymentCreate(client);

    // bi-direction
    await bulkPaymentCreate(client)
}
main();


function readTlsCertificates(): { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } | {} {
    try {
        const certificatesFolder = path.join(__dirname, '..', 'certificates');
        const rootCert = fs.readFileSync(path.join(certificatesFolder, 'ca.crt'));
        const certChain = fs.readFileSync(path.join(certificatesFolder, 'server.crt'));
        const privateKey = fs.readFileSync(path.join(certificatesFolder, 'server.pem'))
        return { rootCert, certChain, privateKey };
    } catch (e) {
        return {};
    }
}