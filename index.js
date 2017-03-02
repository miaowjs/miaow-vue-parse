var pkg = require('./package.json');
var parse = require('./lib/parser');

module.exports = parse;

module.exports.toString = function () {
  return [pkg.name, pkg.version].join('@');
};

