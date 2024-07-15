#!/bin/bash

# Move into the project root
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd "$dir"

# A shell script which publishes all packages to a local Verdaccio registry for testing / local dev purposes

if [[ -z "${VERDACCIO_URL}" ]]; then
  VERDACCIO=http://localhost:4873/
else
  VERDACCIO="${VERDACCIO_URL}"
fi

echo "Publishing to Verdaccio @ $VERDACCIO"

cd ../packages/admin-ui-plugin && npm publish -reg $VERDACCIO &&\
cd ../asset-server-plugin && npm publish -reg $VERDACCIO &&\
cd ../common && npm publish -reg $VERDACCIO &&\
cd ../core && npm publish -reg $VERDACCIO &&\
cd ../create && npm publish -reg $VERDACCIO &&\
cd ../elasticsearch-plugin && npm publish -reg $VERDACCIO &&\
cd ../email-plugin && npm publish -reg $VERDACCIO &&\
cd ../payments-plugin && npm publish -reg $VERDACCIO &&\
cd ../testing && npm publish -reg $VERDACCIO &&\
cd ../ui-devkit && npm publish -reg $VERDACCIO &&\
cd ../job-queue-plugin && npm publish -reg $VERDACCIO &&\
cd ../cli && npm publish -reg $VERDACCIO &&\
cd ../harden-plugin && npm publish -reg $VERDACCIO &&\
cd ../stellate-plugin && npm publish -reg $VERDACCIO &&\
cd ../sentry-plugin && npm publish -reg $VERDACCIO &&\
cd ../admin-ui/package && npm publish -reg $VERDACCIO
