var fs = require('fs');
var path = require('path');

function create(file, cb) {
  fs.access(file, fs.F_OK, function (err) {
    if (err) {
      fs.appendFile(file, '', cb);
    } else {
      cb(null);
    }
  });
}

function getContentsOfNodeModules(place, cb) {
  fs.readdir(path.join(place, 'node_modules'), cb);
}

exports.create = create;
exports.getContentsOfNodeModules = getContentsOfNodeModules;
