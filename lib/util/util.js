"use strict";
var fs = require('fs');
var path = require('path');

function greaterVersion(v1, v2) {
  var ver1, ver2;
  ver1 = v1.split('.').map(function (v) {
    return parseInt(v, 10);
  });
  ver2 = v2.split('.').map(function (v) {
    return parseInt(v, 10);
  });
  if (ver1[0] > ver2[0]) {
    return v1;
  } else if (ver1[0] < ver2[0]) {
    return v2;
  } else if (ver1[1] < ver2[1]) {
    return v2;
  } else if (ver1[1] > ver2[1]) {
    return v1;
  } else if (ver1[2] < ver2[2]) {
    return v2;
  } else if (ver1[2] > ver2[2]) {
    return v1;
  } else {
    return v1;
  }
}

function getLatestVersion(pkg) {
  var latest = '0.0.0',
    versions = pkg.versions,
    i;
  for (i in versions) {
    if (versions.hasOwnProperty(i)) {
      latest = greaterVersion(latest, i);
    }
  }
  return versions[latest];
}

exports.getLatestVersion = getLatestVersion;
exports.greaterVersion = greaterVersion;
