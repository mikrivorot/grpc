// package: payments
// file: payments.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PaymentCreateRequest extends jspb.Message { 
    getPayerId(): number;
    setPayerId(value: number): PaymentCreateRequest;
    getPayeeId(): number;
    setPayeeId(value: number): PaymentCreateRequest;

    hasAmountDetails(): boolean;
    clearAmountDetails(): void;
    getAmountDetails(): Amount | undefined;
    setAmountDetails(value?: Amount): PaymentCreateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentCreateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentCreateRequest): PaymentCreateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PaymentCreateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaymentCreateRequest;
    static deserializeBinaryFromReader(message: PaymentCreateRequest, reader: jspb.BinaryReader): PaymentCreateRequest;
}

export namespace PaymentCreateRequest {
    export type AsObject = {
        payerId: number,
        payeeId: number,
        amountDetails?: Amount.AsObject,
    }
}

export class Amount extends jspb.Message { 
    getAmount(): number;
    setAmount(value: number): Amount;
    getCurrency(): string;
    setCurrency(value: string): Amount;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Amount.AsObject;
    static toObject(includeInstance: boolean, msg: Amount): Amount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Amount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Amount;
    static deserializeBinaryFromReader(message: Amount, reader: jspb.BinaryReader): Amount;
}

export namespace Amount {
    export type AsObject = {
        amount: number,
        currency: string,
    }
}

export class PaymentCreateResponse extends jspb.Message { 
    getStatus(): Status;
    setStatus(value: Status): PaymentCreateResponse;
    getReason(): RejectReasons;
    setReason(value: RejectReasons): PaymentCreateResponse;
    getReceivedAmount(): number;
    setReceivedAmount(value: number): PaymentCreateResponse;
    clearCommentList(): void;
    getCommentList(): Array<string>;
    setCommentList(value: Array<string>): PaymentCreateResponse;
    addComment(value: string, index?: number): string;
    getId(): string;
    setId(value: string): PaymentCreateResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaymentCreateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PaymentCreateResponse): PaymentCreateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PaymentCreateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaymentCreateResponse;
    static deserializeBinaryFromReader(message: PaymentCreateResponse, reader: jspb.BinaryReader): PaymentCreateResponse;
}

export namespace PaymentCreateResponse {
    export type AsObject = {
        status: Status,
        reason: RejectReasons,
        receivedAmount: number,
        commentList: Array<string>,
        id: string,
    }
}

export enum Status {
    RECEIVED = 0,
    PROCESSING = 1,
    FINISHED = 2,
    REJECTED = 3,
}

export enum RejectReasons {
    NOT_SPECIFIED = 0,
    NO_ANSWER = 1,
    INSUFFICIENT_FUNDS = 2,
    NO_PERMISSIONS = 3,
}
