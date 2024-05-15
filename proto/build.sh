#!/bin/bash

 grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:${PROTO_DIR} \
    --grpc_out=${PROTO_DIR} \
    --plugin=protoc-gen-grpc=./node_modules/grpc-tools/.bin/grpc_tools_node_protoc_plugin \
    -I ./proto \
    proto/*.proto