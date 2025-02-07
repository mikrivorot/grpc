import * as  grpc from '@grpc/grpc-js';
import { TransactionsClient } from '../grpc/proto';
import { createSuccessfulPayment, createFailedPayment, deadline, saveSuccessfulPayment } from './unary';
import path from 'path';
// import fs
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export type Certificates = { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer }

async function main() {
    const certificates: Certificates = readTlsCertificates();
    const clientCredentials: grpc.ChannelCredentials = getClientCredentials(certificates);
    const client: TransactionsClient = getGrpcClient(clientCredentials);

    // const x = await Promise.allSettled([
    //     createSuccessfulPayment(client),
    //     saveSuccessfulPayment(client),
    //     createFailedPayment(client),
    //     deadline(client)
    // ]);

    // unary calls reworked to async (Promises with callbacks/calls inside)
    // const x = await Promise.allSettled([
    //     createSuccessfulPayment(client),
    //     saveSuccessfulPayment(client),
    //     createFailedPayment(client),
    //     deadline(client)
    // ]);

    // // server streaming
    // createFailedPaymentWithStep(client);
    // createSuccessfulPaymentWithStep(client);
    // paymentsList(client);

    // // client streaming
    // orderPaymentCreate(client);

    // // bi-direction
    // await bulkPaymentCreate(client)
}
main();


const options = {
    checkServerIdentity: (a: any, b: any): any => undefined
}

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

export function getClientCredentials(certificates: Certificates): grpc.ChannelCredentials {
    return certificates.rootCert ?
        grpc.ChannelCredentials.createSsl(certificates.rootCert, null, null, options) :
        grpc.ChannelCredentials.createInsecure();
}

export function getGrpcClient(credentials: grpc.ChannelCredentials): TransactionsClient {
    return new TransactionsClient(process.env.GRPC_CLIENT_ADDRESS || 'localhost:50051', credentials, {
        'grpc.ssl_target_name_override': 'localhost',
        'grpc.default_authority': 'localhost',
    })
}