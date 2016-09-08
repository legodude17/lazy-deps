"use strict";
var chain = require('slide').chain;
var path = require('path');
var fs = require('fs');
var find = require('./find');
var isCore = require('is-core-module');
var install = require('./util/install');

function (file, options, cb) {
  function addInstalled(msg, installed, cb) {
    msg.installed = installed;
    cb(msg);
  }
  function getMissing(msg, cb) {
    msg.missing = msg.requires.filter(function (v) {
      return !msg.installed.includes(v);
    });
    cb(msg);
  }
  function installMissing(msg, cb) {
    install(msg.missing.filter(function (v) {return !isCore(v); }), function (err, data) {
      if (err) {
        return cb(err);
      }
      cb({
        old: msg.install,
        needed: msg.requires,
        'new': msg.missing,
        data: data,
        msg: msg
      });
    });
  }
  chain([
    [find, file, {}],
    [getContentsOfNodeModules, path.dirname(file)],
    [addInstalled, chain.first, chain.last],
    [getMissing, chain.last],
    [installMissing, chain.last]
  ], cb);

  ASQ(function (done) {
    fs.readFile(path.resolve(file), done.errfcb);
  }).then(function (done, msg) {
    done(findRequiresInText(msg));
  }).then(function (done, msg) {
    getOutput(options, done, msg);
  }).then(function (done, msg) {
    getContentsOfNodeModules(path.dirname(file), function (err, data) {
      if (err) {
        done.fail(err);
        return;
      }
      msg.installed = data;
      done(msg);
    });
  }).then(function (done, msg) {
    var missing = msg.text.requires.filter(function (v) {
      return !msg.installed.includes(v);
    });
    if (!missing.length) {
      console.log(magicpen().yellow('No missing dependencies.').toString('ansi'));
      done(false);
    } else {
      install(missing.filter(function (v) {return !isCore(v); })).then(
        function (a, data) {
          done({
            old: msg.installed,
            'new': missing,
            data: data
          });
        }
      ).or(done.fail);
    }
  }).then(function (a, msg) {
    if (msg) {
      console.log(msg);
      done();
      return;
    }
    done();
  });
}
