var fs = require('fs');
var path = require('path');
var miaow = require('miaow');
var assert = require('assert');
var find = require('lodash.find');

var vueParse = require('..');
describe('miaow-vue-parse', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow({
      cache: path.resolve(__dirname, './cache'),
      output: path.resolve(__dirname, './output'),
      context: path.resolve(__dirname, './fixtures')
    }, function (err) {
      if (err) {
        console.error(err.toString(), err.stack);
        process.exit(1);
      }
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口存在', function () {
    assert(!!vueParse);
  });

  it('VUE单文件编译正常', function () {
    assert.equal(find(log.modules, { src: 'a.vue' }).destHash, '5414b17ab1ef456452ee9edf0c6dfc0d');
  });
});
