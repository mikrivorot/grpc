// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var payments_pb = require('./payments_pb.js');

function serialize_BulkPaymentCreateRequest(arg) {
  if (!(arg instanceof payments_pb.BulkPaymentCreateRequest)) {
    throw new Error('Expected argument of type BulkPaymentCreateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BulkPaymentCreateRequest(buffer_arg) {
  return payments_pb.BulkPaymentCreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BulkPaymentCreateResponse(arg) {
  if (!(arg instanceof payments_pb.BulkPaymentCreateResponse)) {
    throw new Error('Expected argument of type BulkPaymentCreateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BulkPaymentCreateResponse(buffer_arg) {
  return payments_pb.BulkPaymentCreateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaymentServiceService = exports.PaymentServiceService = {
  bulkPaymentCreate: {
    path: '/PaymentService/BulkPaymentCreate',
    requestStream: true,
    responseStream: true,
    requestType: payments_pb.BulkPaymentCreateRequest,
    responseType: payments_pb.BulkPaymentCreateResponse,
    requestSerialize: serialize_BulkPaymentCreateRequest,
    requestDeserialize: deserialize_BulkPaymentCreateRequest,
    responseSerialize: serialize_BulkPaymentCreateResponse,
    responseDeserialize: deserialize_BulkPaymentCreateResponse,
  },
};

exports.PaymentServiceClient = grpc.makeGenericClientConstructor(PaymentServiceService);
