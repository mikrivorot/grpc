// package: 
// file: proto.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as proto_pb from "./proto_pb";
import * as payments_pb from "./payments_pb";

interface IPaymentServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    bulkPaymentCreate: IPaymentServiceService_IBulkPaymentCreate;
}

interface IPaymentServiceService_IBulkPaymentCreate extends grpc.MethodDefinition<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse> {
    path: "/PaymentService/BulkPaymentCreate";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<payments_pb.BulkPaymentCreateRequest>;
    requestDeserialize: grpc.deserialize<payments_pb.BulkPaymentCreateRequest>;
    responseSerialize: grpc.serialize<payments_pb.BulkPaymentCreateResponse>;
    responseDeserialize: grpc.deserialize<payments_pb.BulkPaymentCreateResponse>;
}

export const PaymentServiceService: IPaymentServiceService;

export interface IPaymentServiceServer extends grpc.UntypedServiceImplementation {
    bulkPaymentCreate: grpc.handleBidiStreamingCall<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
}

export interface IPaymentServiceClient {
    bulkPaymentCreate(): grpc.ClientDuplexStream<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
    bulkPaymentCreate(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
    bulkPaymentCreate(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
}

export class PaymentServiceClient extends grpc.Client implements IPaymentServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public bulkPaymentCreate(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
    public bulkPaymentCreate(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<payments_pb.BulkPaymentCreateRequest, payments_pb.BulkPaymentCreateResponse>;
}
