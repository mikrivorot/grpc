export type Certificates = { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer }
import { TransactionsClient } from '../grpc/proto';
import * as grpc from '@grpc/grpc-js';
import path from 'path';
import * as fs from 'fs';

const options = {
    checkServerIdentity: (a: any, b: any): any => undefined
}

export function readTlsCertificates(): { rootCert?: Buffer, certChain?: Buffer, privateKey?: Buffer } | {} {
    try {
        const certificatesFolder = path.join(__dirname, '../grpc/certificates');
        const rootCert = fs.readFileSync(path.join(certificatesFolder, 'ca.crt'));
        const certChain = fs.readFileSync(path.join(certificatesFolder, 'server.crt'));
        const privateKey = fs.readFileSync(path.join(certificatesFolder, 'server.pem'))
        return { rootCert, certChain, privateKey };
    } catch (e) {
        console.log('Credentials not found, see error', e);
        return {};
    }
}


export function getChannelCredentials(certificates?: Certificates): grpc.ChannelCredentials {
    return certificates && certificates?.rootCert ?
        grpc.ChannelCredentials.createSsl(certificates.rootCert, null, null, options) :
        grpc.ChannelCredentials.createInsecure();
}

export function getGrpcClient(credentials: grpc.ChannelCredentials): TransactionsClient {
    return new TransactionsClient(process.env.GRPC_CLIENT_ADDRESS || 'localhost:50051', credentials, {
        'grpc.ssl_target_name_override': 'localhost',
        'grpc.default_authority': 'localhost',
    })
}