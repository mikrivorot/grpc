import * as grpc from '@grpc/grpc-js';
import { PaymentServiceService } from '../proto/index';
import { paymentCreate } from './unary';
import { paymentCreateWithSteps } from './server.streaming'
import { orderPaymentCreate } from './client.streaming'

const address = 'localhost:3001'
function main() {
    const server: grpc.Server = new grpc.Server();
    const credentials = grpc.ServerCredentials.createInsecure();
    process.on('SIGINT', () => {
        cleanup(server);
    })

    server.addService(PaymentServiceService, { paymentCreate, paymentCreateWithSteps, orderPaymentCreate });
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