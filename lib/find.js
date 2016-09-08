"use strict";
var chain = require('slide').chain;
var getDepsFromPackage = require('./util/getDeps').fs;
var findRequiresInText = require('./util.findRequiresInText');
var isCore = require('is-core-module');
module.exports = function find(arg, opts, cb) {
  function getFile(cb) {
    cb(arg);
  }
  function getDeps(msg, data, cb) {
    msg.devDeps = Object.keys(data.dev);
    cb(msg);
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
      cb(msg);
    }
  }
  function findRequires(msg, cb) {
    msg.requires = findRequiresInText(msg.text);
    cb(msg);
  }
  function formatOutput(msg, cb) {
    var output = {};
    var table = [];
    table.push(['Variable Name:', 'Module name:', 'Is core:']);
    if (opts.dev) {
      table[0].push('Is dev:');
    }
    Object.keys(msg.required).forEach(function (i) {
      var v = msg.required[i];
      var idx = table.length;
      table.push([i, v, isCore(v)]);
      if (opts.dev) {
        table[idx].push(msg.devDeps.includes(v));
      }
    });
    output.required = msg.required;
    output.requires = msg.requires;
    output.list = output.requires;
    cb(output);
  }
  chain([
    [getFile],
    !opts.evaluate && [fs, 'readFile', chain.last, 'utf-8'],
    [getArgs, chain.last],
    [findRequires, chain.last],
    [formatOutput, chain.last]
  ], cb);
}
