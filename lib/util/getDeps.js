"use strict";
var request = require('reuqest');
var JSONStream = require('JSONStream');
var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');

function getDepsFromPackageWeb(name, version, cb) {
  if (typeof cb !== 'function') {
    cb = version;
    version = null;
  }
  function handle(pkg) {
    pkg = pkg[0];
    if (!pkg.versions) {
      cb(new Error('Package ' + name + ' not found.'));
      return;
    }
    var data;
    if (!version) {
      data = getLatestVersion(pkg);
    }
    data = pkg.versions[version];
    if (!data) {
      data = getLatestVersion(pkg);
    }
    cb(null, {
      normal: data.dependencies,
      dev: data.devDependencies
    });
  }
  request('http://registry.npmjs.org/' + name).pipe(JSONStream.parse()).pipe(concat(handle));
}

function getDepsFromPackage(folder, cb) {
  function handle(data) {
    data = data[0];
    cb(null, {
      normal: data.dependencies,
      dev: data.devDependencies
    });
  }
  fs.access(path.join(folder, 'package.json'), fs.F_OK, function (err) {
    if (err) {
      fs.createReadStream(path.join(process.cwd(), 'node_modules', folder, 'package.json')).pipe(JSONStream.parse()).pipe(concat(handle));
    } else {
      fs.createReadStream(path.join(folder, 'package.json')).pipe(JSONStream.parse()).pipe(concat(handle));
    }
  });
}

exports.web = getDepsFromPackageWeb;
exports.fs = getDepsFromPackage;
