#!/bin/bash
set -e

VERBOSE=1 yarn config set "strict-ssl" false -g
VERBOSE=1 yarn start:server