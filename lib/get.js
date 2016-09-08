"use strict";
var getDeps = require('./util/getDeps.js');
var chain = require('slide').chain;

moduls.exports = function (arg, options, cb) {
  getDeps[options.web ? 'web' : 'fs'](arg, cb);
}
