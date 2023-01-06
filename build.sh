#!/usr/bin/env bash
#
# Usage: ./build.sh <path/to/vidyut-prakriya>

CRATE=$1

pushd ${CRATE} && make wasm_release
popd

mkdir -p static/data
mkdir -p static/wasm
cp ${CRATE}/www/static/app.js static
cp ${CRATE}/pkg/vidyut_prakriya_bg.wasm static/wasm
cp ${CRATE}/pkg/vidyut_prakriya.js static/wasm
cp ${CRATE}/data/dhatupatha.tsv static/data

echo "Complete. Please manually copy over index.html."
