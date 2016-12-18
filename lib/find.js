"use strict";
var chain = require('slide').chain;
var getDepsFromPackage = require('./util/getDeps').fs;
var findRequiresInText = require('./util/findRequiresInText');
var isCore = require('is-core-module');
var fs = require('fs');
module.exports = function find(arg, opts, cb) {
  function getFile(cb) {
    cb(null, arg);
  }

  function getDeps(msg, data, cb) {
    msg.devDeps = Object.keys(data.dev);
    cb(null, msg);
  }

  function getArgs(text, cb) {
    var msg = {};
    msg.text = text;
    if (opts.dev) {
      chain([
        [getDepsFromPackage, process.cwd()],
        [getDeps, msg, chain.last]
      ], cb);
    } else {
      cb(null, msg);
    }
  }

  function findRequires(msg, cb) {
    msg.requires = findRequiresInText(msg.text);
    cb(null, msg);
  }

  function formatOutput(msg, cb) {
    var output = {};
    var table = [];
    table.push(['Variable Name:', 'Module name:', 'Is core:']);
    if (opts.dev) {
      table[0].push('Is dev:');
    }
    Object.keys(msg.requires.required).forEach(function (i) {
      var v = msg.requires.required[i];
      var idx = table.length;
      table.push([i, v, isCore(v)]);
      if (opts.dev) {
        table[idx].push(msg.devDeps.includes(v));
      }
    });
    output.required = msg.requires.required;
    output.requires = msg.requires.requires;
    output.list = output.requires;
    output.table = table;
    cb(null, output);
  }
  chain([
    [getFile], !opts.evaluate && [fs, 'readFile', chain.last, 'utf-8'],
    [getArgs, chain.last],
    [findRequires, chain.last],
    [formatOutput, chain.last]
  ], cb);
}