/*jslint node:true*/
'use strict';
var exec = require('child_process').exec;
module.exports = function i(pkgs, cb) {
  exec('npm i --save ' + pkg.join(' '), cb);
};
