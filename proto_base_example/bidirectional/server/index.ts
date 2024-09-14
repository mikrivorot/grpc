import * as grpc from '@grpc/grpc-js';
import { PaymentServiceService } from '../proto/index';
import { Service } from './service';

const address = 'localhost:3001'
function main() {
    const server: grpc.Server = new grpc.Server();
    const credentials = grpc.ServerCredentials.createInsecure();
    process.on('SIGINT', () => {
        cleanup(server);
    })

    server.addService(PaymentServiceService, Service);
    server.bindAsync(address, credentials, (error, _) => {
        if (error) {
            cleanup(server);
        }
    })
}

function cleanup(server: grpc.Server) {
    if (server) {
        server.forceShutdown();
    }
}

main();