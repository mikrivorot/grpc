https://rsbh.dev/blogs/grpc-with-nodejs-typescript

## Problem 
In *unary/build/payment_grpc_pb.d.ts* uses `grpc` instead of `@grpc/grpc-js`
```
import * as grpc from "grpc";
```

This causes errors in ts files, because `grpc` and `@grpc/grpc-js` types are not equal:
```
Argument of type 'IPaymentServiceService' is not assignable to parameter of type 'ServiceDefinition<UntypedServiceImplementation>'.
  Index signature for type 'string' is missing in type 'IPaymentServiceService'.ts(2345)
```

Question was raised and fixed 5 years ago:

https://github.com/grpc/grpc-node/issues/931

`[question] How to generate require('@grpc/grpc-js') instead of require('grpc') `

Solution and documentation here: [What grpc_tools_node_protoc_ts changed](https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/master/doc/grpcjs_support.md#what-grpc_tools_node_protoc_ts-changed)

We need to specify via parameter `--ts_out=`**grpc_js**:`./unary/build` instead of `--ts_out=./unary/build`

