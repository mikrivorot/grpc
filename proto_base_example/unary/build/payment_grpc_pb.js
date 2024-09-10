// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var payment_pb = require('./payment_pb.js');

function serialize_payment_PaymentCreateRequest(arg) {
  if (!(arg instanceof payment_pb.PaymentCreateRequest)) {
    throw new Error('Expected argument of type payment.PaymentCreateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payment_PaymentCreateRequest(buffer_arg) {
  return payment_pb.PaymentCreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_payment_PaymentCreateResponse(arg) {
  if (!(arg instanceof payment_pb.PaymentCreateResponse)) {
    throw new Error('Expected argument of type payment.PaymentCreateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_payment_PaymentCreateResponse(buffer_arg) {
  return payment_pb.PaymentCreateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaymentServiceService = exports.PaymentServiceService = {
  paymentCreate: {
    path: '/payment.PaymentService/PaymentCreate',
    requestStream: false,
    responseStream: false,
    requestType: payment_pb.PaymentCreateRequest,
    responseType: payment_pb.PaymentCreateResponse,
    requestSerialize: serialize_payment_PaymentCreateRequest,
    requestDeserialize: deserialize_payment_PaymentCreateRequest,
    responseSerialize: serialize_payment_PaymentCreateResponse,
    responseDeserialize: deserialize_payment_PaymentCreateResponse,
  },
};

exports.PaymentServiceClient = grpc.makeGenericClientConstructor(PaymentServiceService);
