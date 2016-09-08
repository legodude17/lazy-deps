"use strict";
var tar = require('tar');
var zlib = require('zlib');
var latestVersion = require('./util/util.js').getLatestVersion;
var RegClient = require('npm-registry-client');
var chain = require('slide').chain;
var client = new RegClient();
var REGISTRY = 'https://registry.npmjs.org/';
module.exports = function (name, cb) {
  var extractOpts = { type: 'Directory', path: name, strip: 1 };
  function latest(pkg, cb) {
    cb(latestVersion(pkg).dist.tarball);
  }
  function unpack(res, cb) {
    res
      .on('error', cb)
      .pipe(zlib.Unzip())
      .on('error', cb)
      .pipe(tar.Extract(extractOpts))
      .on('error', cb)
      .on('close', cb);
  }
  chain([
    [client, 'get', REGISTRY + name, {}],
    [latest, chain.last],
    [client, 'fetch', chain.last, {}],
    [unpack, chain.last]
  ], cb);
};
