var fs = require('fs');
var path = require('path');
var async = require('async');
var mutil = require('miaow-util');
var parse = require('./lib/parse');
var pkg = require('./package.json');

var scriptTemplate = fs.readFileSync(path.resolve(__dirname, './lib/vue-script-template.js'));

function resolveVuePart(type, part, callback) {
  var context = this;
  var pickModuleUrl = function (err, module) {
    if (err) {
      return callback(err);
    }
    var url = 'module://' + module.src;
    if (type === 'template') {
      url += '#content';
    } else if (type === 'style' && part.modulelarized) {
      url += '#module';
    }
    return callback(err, url);
  };

  if (!part) {
    callback();
  } else if (part.src) {
    context.resolveModule(part.src, pickModuleUrl);
  } else {
    var content = part.content;
    var src = context.src + '.' + (type === 'script' ? 'script.' : '') + part.lang;
    context.emitModule(src, content, pickModuleUrl);
  }
}

module.exports = function (options, callback) {
  var context = this;
  var content = context.contents.toString();
  var parts;

  parts = parse(content, options);

  // check if there are any template syntax errors
  var templateWarnings = parts.template && parts.template.warnings;
  if (templateWarnings) {
    templateWarnings.forEach(mutil.console.warn);
  }

  if (!parts.script) {
    // callback(new Error('script part cannot be found in vue component: ' + context.src));
    // return;
    parts.script = {
      content: 'export default {}',
      lang: 'es6'
    };
  }

  async.parallel({
    script: resolveVuePart.bind(context, 'script', parts.script),
    template: resolveVuePart.bind(context, 'template', parts.template),
    style: resolveVuePart.bind(context, 'style', parts.style)
  }, function (err, moduleUrl) {
    if (err) {
      return callback(err);
    }

    var deps = [moduleUrl.script];

    if (moduleUrl.template) {
      deps.push(moduleUrl.template);
    }
    if (moduleUrl.style) {
      deps.push(moduleUrl.style);
    }
    context.contents = new Buffer('define (' + JSON.stringify(deps) + ', function (){\n' +
      scriptTemplate + '\n});');

    return callback();
  });
};

module.exports.toString = function () {
  return [pkg.name, pkg.version].join('@');
};
