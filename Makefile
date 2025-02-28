PROTO_DIR=./proto
OUT_DIR=./build_py
CURRENT_DIR=$(shell pwd)
.PHONY: test-unit test-integration test

generate:
	mkdir -p $(OUT_DIR)
	python -m grpc_tools.protoc \
		-I $(PROTO_DIR) \
		--python_out=$(OUT_DIR) \
		--grpc_python_out=$(OUT_DIR) \
		$(PROTO_DIR)/*.proto
	touch $(OUT_DIR)/__init__.py

start:
	PYTHONPATH=$(CURRENT_DIR):$(CURRENT_DIR)/build_py uvicorn client.main:app --reload

debug:
	PYTHONPATH=$(CURRENT_DIR):$(CURRENT_DIR)/build_py PYTHONDEBUG=1 uvicorn client.main:app --reload --log-level debug --port 8000

test-client:
	PYTHONPATH=$(CURRENT_DIR):$(CURRENT_DIR)/build_py pytest tests/grpc_client/test_api_unit.py -v