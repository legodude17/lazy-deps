"use strict";
var getDeps = require('./util/getDeps.js');

module.exports = function (arg, options, cb) {
  getDeps[options.web ? 'web' : 'fs'](arg, cb);
}
