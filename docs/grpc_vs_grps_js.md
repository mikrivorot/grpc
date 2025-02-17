## Problem #1: wrong gRPC import in generated ts files

https://rsbh.dev/blogs/grpc-with-nodejs-typescript just an article about gRPC with NodeJS and TypeScript.

In *build/payment_grpc_pb.d.ts* uses `grpc` instead of `@grpc/grpc-js`
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

We need to specify via parameter `--ts_out=`**grpc_js**:`./build` instead of `--ts_out=./build`

## Problem #2 - incompatible protobuf versions
`Detected incompatible Protobuf Gencode/Runtime versions when loading transactions.proto: gencode 5.29.0 runtime 5.28.0.`

Weird:

```toml
...
# pyproject.toml
 "protobuf>=5.29.3",
...
```

```bash
pip show protobuf
# Output (related to global installation on python level)
# Name: protobuf
# Version: 5.28.0
# Summary: 
# Home-page: https://developers.google.com/protocol-buffers/
# Author: protobuf@googlegroups.com
# Author-email: protobuf@googlegroups.com
# License: 3-Clause BSD License
```

I fixed it by upgrading `protobuf` to `5.29.0` globally

```bash
pip install protobuf==5.29.0
```