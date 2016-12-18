"use strict";
var find = require('../find');
var chalk = require('chalk');
var table = require('table').default;
exports.command = 'find [file]';
exports.describe = 'find all requires in <file>';
exports.builder = function (yargs) {
  return yargs
    .alias({
      'dev': 'd',
      'evaluate': 'e'
    })
    .boolean('dev')
    .default('dev', false)
    .default('evaluate', false);
};
exports.handler = function (argv) {
  function cb(err, output) {
    if (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    }
    output = output.pop();
    output.table[0] = output.table[0].map(function (v) {
      return chalk.magenta(v);
    });
    output.table = output.table.map(function (v) {
      return v.map(function (v) {
        if (typeof v === 'boolean') {
          return v ? chalk.blue(v) : chalk.yellow(v);
        }
        return v;
      });
    })
    var list = output.list.join('\n    ');
    console.log(chalk.green((argv.file ? 'Requires in file ' + chalk.yellow(argv.file) : 'Requires in text ' + chalk.yellow(argv.evaluate))) + ':');
    console.log('    ' + list);
    console.log(table(output.table));
  }
  if (argv.e) {
    find(argv.e, {
      dev: argv.dev,
      evaluate: true
    }, cb);
  } else if (argv.file) {
    find(argv.file, {
      dev: argv.dev
    }, cb);
  } else {
    console.error('Must specify either ' + chalk.yellow('<file>') + ' or ' + chalk.yellow('-e'));
  }
};