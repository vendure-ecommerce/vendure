#!/bin/bash

# A shell script which publishes all packages to a local Verdaccio registry for testing / local dev purposes
VERDACCIO=http://localhost:4873/

cd ../packages/admin-ui-plugin && npm publish -reg $VERDACCIO &&\
cd ../admin-ui && npm publish -reg $VERDACCIO &&\
cd ../asset-server-plugin && npm publish -reg $VERDACCIO &&\
cd ../common && npm publish -reg $VERDACCIO &&\
cd ../core && npm publish -reg $VERDACCIO &&\
cd ../create && npm publish -reg $VERDACCIO &&\
cd ../elasticsearch-plugin && npm publish -reg $VERDACCIO &&\
cd ../email-plugin && npm publish -reg $VERDACCIO
