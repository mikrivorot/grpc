// package: payment
// file: payment.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as payment_pb from "./payment_pb";

interface IPaymentServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    paymentCreate: IPaymentServiceService_IPaymentCreate;
}

interface IPaymentServiceService_IPaymentCreate extends grpc.MethodDefinition<payment_pb.PaymentCreateRequest, payment_pb.PaymentCreateResponse> {
    path: "/payment.PaymentService/PaymentCreate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<payment_pb.PaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payment_pb.PaymentCreateRequest>;
    responseSerialize: grpc.serialize<payment_pb.PaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payment_pb.PaymentCreateResponse>;
}

export const PaymentServiceService: IPaymentServiceService;

export interface IPaymentServiceServer {
    paymentCreate: grpc.handleUnaryCall<payment_pb.PaymentCreateRequest, payment_pb.PaymentCreateResponse>;
}

export interface IPaymentServiceClient {
    paymentCreate(request: payment_pb.PaymentCreateRequest, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    paymentCreate(request: payment_pb.PaymentCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    paymentCreate(request: payment_pb.PaymentCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
}

export class PaymentServiceClient extends grpc.Client implements IPaymentServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public paymentCreate(request: payment_pb.PaymentCreateRequest, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    public paymentCreate(request: payment_pb.PaymentCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    public paymentCreate(request: payment_pb.PaymentCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payment_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
}
