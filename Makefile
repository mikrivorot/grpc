PROTO_DIR=./proto
OUT_DIR=./build_py

generate:
	mkdir -p $(OUT_DIR)
	python -m grpc_tools.protoc -I $(PROTO_DIR) --python_out=$(OUT_DIR) --grpc_python_out=$(OUT_DIR) $(PROTO_DIR)/*.proto