#!/bin/bash

ROOT=./scripts

BIN=$ROOT/bin
BABEL=./node_modules/babel-cli/bin/babel.js

# Guild
$BABEL $ROOT/guild.babel.js --out-file $ROOT/guild.js
$BABEL $BIN/guild.babel --out-file $BIN/guild
