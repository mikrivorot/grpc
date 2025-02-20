### Problem #1: wrong gRPC import in generated ts files

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

We need to specify via parameter 

```bash
--ts_out=grpc_j:./build
```

instead of 
```bash
--ts_out=./build
```


---


### Problem #2 - incompatible protobuf versions
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


So with these changes it works for me

---

### Problem #3 - unimplemented methods

If method is not implemented, grpc Error returned for client call:
```
Error received: 12 UNIMPLEMENTED: The server does not implement the method <method name>
```

---
### Problem #4 - proper certificates generation
https://medium.com/@ankitgrg.26/generate-a-self-signed-certificate-for-grpc-java-56323df05be4

#### Changes these CN's to match your hosts in your environment if needed.
```
SERVER_CN=localhost
```

#### Step 1: Generate Certificate Authority + Trust Certificate (ca.crt)
```
openssl genrsa -passout pass:1111 -des3 -out ca.key 4096
openssl req -passin pass:1111 -new -x509 -days 365 -key ca.key -out ca.crt -subj "/CN=${SERVER_CN}"
```

#### Step 2: Generate the Server Private Key (server.key)
```
openssl genrsa -passout pass:1111 -des3 -out server.key 4096
```

#### Step 3: Get a certificate signing request from the CA (server.csr)
```
openssl req -passin pass:1111 -new -key server.key -out server.csr -subj "/CN=${SERVER_CN}"
```

#### Step 4: Sign the certificate with the CA we created (it's called self signing) - server.crt
```
openssl x509 -req -passin pass:1111 -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
```

#### Step 5: Convert the server certificate to .pem format (server.pem) - usable by gRPC
```
openssl pkcs8 -topk8 -nocrypt -passin pass:1111 -in server.key -out server.pem
```


#### Problem #5 - access mongo

```
docker exec -i -t <container_name> mongosh -u <username> -p <password>
```