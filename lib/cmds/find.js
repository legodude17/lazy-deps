"use strict";
var find = require('../find');
var chalk = require('chalk');
var table = require('table');
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
    output.table[0] = output.table[0].map(chalk.blue);
    var list = output.list.join('\n    ');
    console.log(chalk.green((argv.file ? 'Requires in file ' + chalk.yellow(argv.file) : 'Requires in text ' + chalk.yellow(argv.evaluate)) + ':'));
    console.log(list);
    console.log(table(output.table));
  }
  if (argv.e) {
    find(argv.e, {dev: argv.dev, evaluate: true}, cb);
  } else if (argv.file){
    find(argv.file, {dev: argv.dev}, cb);
  } else {
    console.error('Must specify either ' + chalk.yellow('<file>') + ' or ' + chalk.yellow('-e') + '!');
  }
};
