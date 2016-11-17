#! /usr/bin/node
"use strict";

var yargs = require('yargs');
var pkg = require('./package.json');
var argv = yargs
  .usage('Usage: deps <command>')
  .commandDir('lib/cmds')
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright (c) 2016 JDB Released Under MIT License')
  .argv;
console.log(argv);
