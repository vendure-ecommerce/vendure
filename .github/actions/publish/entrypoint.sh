#!/bin/sh

set -e

local_registry="http://0.0.0.0:4873"

# start local registry
tmp_registry_log=`mktemp`
sh -c "mkdir -p $HOME/.config/verdaccio"
sh -c "cp --verbose /config.yaml $HOME/.config/verdaccio/config.yaml"
sh -c "nohup verdaccio --config $HOME/.config/verdaccio/config.yaml &>$tmp_registry_log &"
# wait for `verdaccio` to boot
# FIXME: this throws a syntax error, but would be great to make it run
# grep -q 'http address' <(tail -f $tmp_registry_log)
# login so we can publish packages
sh -c "npm-auth-to-token -u test -p test -e test@test.com -r $local_registry"

sh -c "cd /github/workspace"

# https://stackoverflow.com/a/19132229/772859
sh -c "yarn config set unsafe-perm true"

sh -c "yarn install"
sh -c "yarn bootstrap"
sh -c "yarn lerna publish prepatch --preid ci --no-push --no-git-tag-version --no-commit-hooks --force-publish \"*\" --yes --dist-tag ci --registry $local_registry"
