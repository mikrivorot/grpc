import * as grpc from '@grpc/grpc-js';
import { TransactionsService, ITransactionsServer } from '../proto';
import { transactionCommit } from './unary';
import { transactionCommitWithSteps } from './server.streaming';
import { transactionsCommit } from './client.streaming';
import { bulkTransactionsCommit } from './bidirectional';
import fs from 'node:fs';
import path from 'path';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
dotenv.config();

const address = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';

if (!address) {
    throw new Error('GRPC_SERVER_ADDRESS env variable is not set');
}

const server: grpc.Server = prepareGrpcServerWithRegisteredServices();
export const tryShutdownAsync = promisify(server.tryShutdown).bind(server);

export async function startGrpcServer() {
    const bindServerToAddressAsync = preparePromisifiedGrpcServerBind(server);

    process.on('SIGINT', async () => {
        await stopGrpcServer();
    })

    try {
        const credentials: grpc.ServerCredentials = gerServerCredentials();
        await bindServerToAddressAsync(address, credentials);
        console.debug(`Server started on ${address}`);
    } catch (e) {
        console.error(`Cannot start gRPC server: ` + e)
        process.exit(1);
    }
}

/**
 * The function `gerServerCredentials` returns gRPC server credentials based on TLS certificates 
 * if available, 
 * otherwise it creates insecure credentials.
 */
function gerServerCredentials(): grpc.ServerCredentials {
    const certificates: { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } = readTlsCertificates();
    return certificates.privateKey && certificates.certChain ?
        grpc.ServerCredentials.createSsl(null, [{
            private_key: certificates.privateKey,
            cert_chain: certificates.certChain
        }], false)
        : grpc.ServerCredentials.createInsecure();
}

/**
 * The function `readTlsCertificates` reads TLS certificates from a specified folder and returns them
 */
export function readTlsCertificates(): { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } | {} {
    try {
        const certificatesFolder = path.join(__dirname, '..', 'certificates');
        const rootCert = fs.readFileSync(path.join(certificatesFolder, 'ca.crt'));
        const certChain = fs.readFileSync(path.join(certificatesFolder, 'server.crt'));
        const privateKey = fs.readFileSync(path.join(certificatesFolder, 'server.pem'))
        return { rootCert, certChain, privateKey };
    } catch {
        return {};
    }
}

export async function cleanup() {
    await stopGrpcServer();
}

export async function stopGrpcServer(): Promise<void> {
    try {
        await tryShutdownAsync?.();
    } catch (error) {
        console.error('Error while stopping server:', error);
    }
}

function prepareGrpcServerWithRegisteredServices(): grpc.Server {
    const server: grpc.Server = new grpc.Server();
    server.addService(TransactionsService as grpc.ServiceDefinition<ITransactionsServer>, {
        transactionCommit,
        transactionCommitWithSteps,
        transactionsCommit,
        bulkTransactionsCommit
    });
    return server
}

function preparePromisifiedGrpcServerBind(server: grpc.Server) {
    return promisify(server.bindAsync).bind(server);
}

if (require.main === module) {
    startGrpcServer().catch(stopGrpcServer);
}