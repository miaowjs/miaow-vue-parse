var miaowVueParser = require('../../');
var developmentConfig = require('miaow-development-config');
var productionConfig;

// replace vue-parser
developmentConfig.modules.forEach(function (moduleConf) {
  if (moduleConf.test === '*.vue') {
    moduleConf.tasks.forEach(function (task, index) {
      if (task.toString().match(/miaow-vue-parse/)) {
        moduleConf.tasks[index] = miaowVueParser;
      }
    });
  }
});

try {
  productionConfig = require('miaow-production-config');
} catch (e) {}

developmentConfig.domain = './';

module.exports = [developmentConfig, productionConfig];
