"use strict";
var fetch = require('../fetch');
var chalk = require('chalk');
exports.command = 'fetch <package>';
exports.describe = 'download and unpack the latest version of <package>';
exports.handler = function (argv) {
  console.log(chalk.blue('Beginning Download'), 'of', chalk.cyan(argv.package));
  fetch(argv.package, function (err) {
    if (err) {
      console.error(chalk.red(err));
      process.exit(1);
    }
    console.log(chalk.green('Finished Download'), 'of', chalk.cyan(argv.package));
  });
};
