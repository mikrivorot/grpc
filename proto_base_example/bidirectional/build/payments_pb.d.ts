// package: 
// file: payments.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as status_pb from "./status_pb";

export class BulkPaymentCreateRequest extends jspb.Message { 
    getPayerId(): number;
    setPayerId(value: number): BulkPaymentCreateRequest;
    getPayeeId(): number;
    setPayeeId(value: number): BulkPaymentCreateRequest;
    getAmount(): number;
    setAmount(value: number): BulkPaymentCreateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPaymentCreateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPaymentCreateRequest): BulkPaymentCreateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPaymentCreateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPaymentCreateRequest;
    static deserializeBinaryFromReader(message: BulkPaymentCreateRequest, reader: jspb.BinaryReader): BulkPaymentCreateRequest;
}

export namespace BulkPaymentCreateRequest {
    export type AsObject = {
        payerId: number,
        payeeId: number,
        amount: number,
    }
}

export class BulkPaymentCreateResponse extends jspb.Message { 
    getStatus(): status_pb.Status;
    setStatus(value: status_pb.Status): BulkPaymentCreateResponse;
    getPaymentId(): string;
    setPaymentId(value: string): BulkPaymentCreateResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPaymentCreateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPaymentCreateResponse): BulkPaymentCreateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPaymentCreateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPaymentCreateResponse;
    static deserializeBinaryFromReader(message: BulkPaymentCreateResponse, reader: jspb.BinaryReader): BulkPaymentCreateResponse;
}

export namespace BulkPaymentCreateResponse {
    export type AsObject = {
        status: status_pb.Status,
        paymentId: string,
    }
}
