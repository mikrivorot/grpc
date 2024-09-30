import * as grpc from '@grpc/grpc-js';
import { PaymentServiceService, IPaymentServiceService } from '../proto';
import { paymentCreate, paymentSave } from './unary';
import { paymentCreateWithSteps, paymentsList } from './server.streaming'
import { orderPaymentCreate } from './client.streaming'
import { bulkPaymentCreate } from './bidirectional';
import fs from 'node:fs';
import path from 'path';
import { connect } from './db';
import { MongoClient } from 'mongodb';

const address = 'localhost:50051'

async function main() {
    const server: grpc.Server = new grpc.Server();
    const certificates: { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } = readTlsCertificates();
    const credentials = certificates.privateKey && certificates.certChain ?
        grpc.ServerCredentials.createSsl(null, [{
            private_key: certificates.privateKey,
            cert_chain: certificates.certChain
        }], false)
        : grpc.ServerCredentials.createInsecure();

    const client: MongoClient = await connect();
    const db = client.db('payments');

    const collections: any[] = await db.listCollections<{ name: string }>().toArray();

    if (!collections && collections) {
        throw Error();
    }

    process.on('SIGINT', async () => {
        await cleanup(server, client);
    })


    server.addService(PaymentServiceService as grpc.ServiceDefinition<IPaymentServiceService>, {
        paymentCreate,
        paymentCreateWithSteps,
        orderPaymentCreate,
        bulkPaymentCreate,
        paymentSave,
        paymentsList
    });
    server.bindAsync(address, credentials, async (error, _) => {
        if (error) {
            await cleanup(server, client);
        }
    })
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

async function cleanup(server: grpc.Server, db?: MongoClient) {
    if (server) {
        await db?.close();
        server.forceShutdown();
    }
}

main().catch(cleanup);