// package: 
// file: main.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as main_pb from "./main_pb";
import * as payments_pb from "./payments_pb";

interface IPaymentServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    paymentCreate: IPaymentServiceService_IPaymentCreate;
    paymentCreateWithSteps: IPaymentServiceService_IPaymentCreateWithSteps;
    orderPaymentCreate: IPaymentServiceService_IOrderPaymentCreate;
    bulkPaymentCreate: IPaymentServiceService_IBulkPaymentCreate;
}

interface IPaymentServiceService_IPaymentCreate extends grpc.MethodDefinition<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse> {
    path: "/PaymentService/PaymentCreate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<payments_pb.PaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payments_pb.PaymentCreateRequest>;
    responseSerialize: grpc.serialize<payments_pb.PaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payments_pb.PaymentCreateResponse>;
}
interface IPaymentServiceService_IPaymentCreateWithSteps extends grpc.MethodDefinition<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse> {
    path: "/PaymentService/PaymentCreateWithSteps";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<payments_pb.PaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payments_pb.PaymentCreateRequest>;
    responseSerialize: grpc.serialize<payments_pb.PaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payments_pb.PaymentCreateResponse>;
}
interface IPaymentServiceService_IOrderPaymentCreate extends grpc.MethodDefinition<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse> {
    path: "/PaymentService/OrderPaymentCreate";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<payments_pb.PaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payments_pb.PaymentCreateRequest>;
    responseSerialize: grpc.serialize<payments_pb.PaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payments_pb.PaymentCreateResponse>;
}
interface IPaymentServiceService_IBulkPaymentCreate extends grpc.MethodDefinition<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse> {
    path: "/PaymentService/BulkPaymentCreate";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<payments_pb.PaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payments_pb.PaymentCreateRequest>;
    responseSerialize: grpc.serialize<payments_pb.PaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payments_pb.PaymentCreateResponse>;
}

export const PaymentServiceService: IPaymentServiceService;

export interface IPaymentServiceServer extends grpc.UntypedServiceImplementation {
    paymentCreate: grpc.handleUnaryCall<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    paymentCreateWithSteps: grpc.handleServerStreamingCall<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    orderPaymentCreate: grpc.handleClientStreamingCall<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    bulkPaymentCreate: grpc.handleBidiStreamingCall<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
}

export interface IPaymentServiceClient {
    paymentCreate(request: payments_pb.PaymentCreateRequest, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    paymentCreate(request: payments_pb.PaymentCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    paymentCreate(request: payments_pb.PaymentCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    paymentCreateWithSteps(request: payments_pb.PaymentCreateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<payments_pb.PaymentCreateResponse>;
    paymentCreateWithSteps(request: payments_pb.PaymentCreateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<payments_pb.PaymentCreateResponse>;
    orderPaymentCreate(callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    orderPaymentCreate(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    orderPaymentCreate(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    orderPaymentCreate(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    bulkPaymentCreate(): grpc.ClientDuplexStream<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    bulkPaymentCreate(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    bulkPaymentCreate(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
}

export class PaymentServiceClient extends grpc.Client implements IPaymentServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public paymentCreate(request: payments_pb.PaymentCreateRequest, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    public paymentCreate(request: payments_pb.PaymentCreateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    public paymentCreate(request: payments_pb.PaymentCreateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientUnaryCall;
    public paymentCreateWithSteps(request: payments_pb.PaymentCreateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<payments_pb.PaymentCreateResponse>;
    public paymentCreateWithSteps(request: payments_pb.PaymentCreateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<payments_pb.PaymentCreateResponse>;
    public orderPaymentCreate(callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    public orderPaymentCreate(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    public orderPaymentCreate(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    public orderPaymentCreate(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: payments_pb.PaymentCreateResponse) => void): grpc.ClientWritableStream<payments_pb.PaymentCreateRequest>;
    public bulkPaymentCreate(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
    public bulkPaymentCreate(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.PaymentCreateRequest, payments_pb.PaymentCreateResponse>;
}
