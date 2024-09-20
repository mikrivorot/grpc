import * as grpc from '@grpc/grpc-js';
import { PaymentServiceService } from '../proto/index';
import { paymentCreate } from './unary';
import { paymentCreateWithSteps } from './server.streaming'
import { orderPaymentCreate } from './client.streaming'
import { bulkPaymentCreate } from './bidirectional';
import fs from 'node:fs';
import path from 'path';

const address = 'localhost:50051'
function main() {
    const server: grpc.Server = new grpc.Server();
    const certificates: { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } = readTlsCertificates();
    const credentials = certificates.privateKey && certificates.certChain ?
        grpc.ServerCredentials.createSsl(null, [{
            private_key: certificates.privateKey,
            cert_chain: certificates.certChain
        }], false)
        : grpc.ServerCredentials.createInsecure();

    process.on('SIGINT', () => {
        cleanup(server);
    })

    server.addService(PaymentServiceService, { paymentCreate, paymentCreateWithSteps, orderPaymentCreate, bulkPaymentCreate });
    server.bindAsync(address, credentials, (error, _) => {
        if (error) {
            cleanup(server);
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

function cleanup(server: grpc.Server) {
    if (server) {
        server.forceShutdown();
    }
}

main();