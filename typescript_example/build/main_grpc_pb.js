// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var payments_pb = require('./payments_pb.js');

function serialize_payments_PaymentCreateRequest(arg) {
  if (!(arg instanceof payments_pb.PaymentCreateRequest)) {
    throw new Error('Expected argument of type payments.PaymentCreateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payments_PaymentCreateRequest(buffer_arg) {
  return payments_pb.PaymentCreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_payments_PaymentCreateResponse(arg) {
  if (!(arg instanceof payments_pb.PaymentCreateResponse)) {
    throw new Error('Expected argument of type payments.PaymentCreateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payments_PaymentCreateResponse(buffer_arg) {
  return payments_pb.PaymentCreateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaymentServiceService = exports.PaymentServiceService = {
  paymentCreate: {
    path: '/PaymentService/PaymentCreate',
    requestStream: false,
    responseStream: false,
    requestType: payments_pb.PaymentCreateRequest,
    responseType: payments_pb.PaymentCreateResponse,
    requestSerialize: serialize_payments_PaymentCreateRequest,
    requestDeserialize: deserialize_payments_PaymentCreateRequest,
    responseSerialize: serialize_payments_PaymentCreateResponse,
    responseDeserialize: deserialize_payments_PaymentCreateResponse,
  },
  paymentCreateWithSteps: {
    path: '/PaymentService/PaymentCreateWithSteps',
    requestStream: false,
    responseStream: true,
    requestType: payments_pb.PaymentCreateRequest,
    responseType: payments_pb.PaymentCreateResponse,
    requestSerialize: serialize_payments_PaymentCreateRequest,
    requestDeserialize: deserialize_payments_PaymentCreateRequest,
    responseSerialize: serialize_payments_PaymentCreateResponse,
    responseDeserialize: deserialize_payments_PaymentCreateResponse,
  },
  orderPaymentCreate: {
    path: '/PaymentService/OrderPaymentCreate',
    requestStream: true,
    responseStream: false,
    requestType: payments_pb.PaymentCreateRequest,
    responseType: payments_pb.PaymentCreateResponse,
    requestSerialize: serialize_payments_PaymentCreateRequest,
    requestDeserialize: deserialize_payments_PaymentCreateRequest,
    responseSerialize: serialize_payments_PaymentCreateResponse,
    responseDeserialize: deserialize_payments_PaymentCreateResponse,
  },
  bulkPaymentCreate: {
    path: '/PaymentService/BulkPaymentCreate',
    requestStream: true,
    responseStream: true,
    requestType: payments_pb.PaymentCreateRequest,
    responseType: payments_pb.PaymentCreateResponse,
    requestSerialize: serialize_payments_PaymentCreateRequest,
    requestDeserialize: deserialize_payments_PaymentCreateRequest,
    responseSerialize: serialize_payments_PaymentCreateResponse,
    responseDeserialize: deserialize_payments_PaymentCreateResponse,
  },
};

exports.PaymentServiceClient = grpc.makeGenericClientConstructor(PaymentServiceService);
