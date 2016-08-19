var developmentConfig = require('miaow-development-config');
var productionConfig;

try {
  productionConfig = require('miaow-production-config');
} catch (e) {}

developmentConfig.domain = './';

module.exports = [developmentConfig, productionConfig];
