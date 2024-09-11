import * as grpc from '@grpc/grpc-js';
import { PaymentServiceService } from '../build/payment_grpc_pb';
import paymentCreate from './service';

const address = 'localhost:3001'
function main() {
    const server: grpc.Server = new grpc.Server();
    const credentials = grpc.ServerCredentials.createInsecure();
    process.on('SIGINT', () => {
        cleanup(server);
    })

    server.addService(PaymentServiceService, { paymentCreate });
    server.bindAsync(address, credentials, (error, _) => {
        if (error) {
            cleanup(server);
        } else {
            server.start();
        }
    })
}

function cleanup(server: grpc.Server) {
    if (server) {
        server.forceShutdown();
    }
}

main();