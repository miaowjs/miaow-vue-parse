var compileTemplate = require('./template-compiler');
var genId = require('./gen-id');
var compiler = require('vue-template-compiler');
var mutil = require('miaow-util');
var Promise = require('promise');
var path = require('path');
var fs = require('fs');

var NORMALIZE_COMPONENT_CODE = fs.readFileSync(
  path.resolve(__dirname, './component-normalizer.js')
);

function getPartImport(type, part, context, scopedId) {
  return new Promise(function (resolve, reject) {
    if (!part) {
      resolve();
      return;
    }

    var callback = function (err, module) {
      if (err) {
        return reject(err);
      }
      var url = 'module://' + module.src;
      var hash = []
      if (type === 'style'){
        if (part.module) {
          hash.push('module');
        }
        if(part.scoped) {
          hash.push('scoped=' + scopedId);
        }
      }

      if (hash.length) {
        url += '#' + hash.join('&');
      }
      return resolve(url);
    };

    if (part.src) {
      context.resolveModule(part.src, callback);
    } else {
      var defaultExt = {
        style: 'css',
        script: 'script.es6'
      };
      var src = context.src + "." + (part.lang || defaultExt[type]);
      context.emitModule(src, part.content, callback);
    }
  });
}


module.exports = function (options, callback) {
  var context = this;
  var content = context.contents.toString();
  var parts = compiler.parseComponent(content, { pad: true });
  var hasScoped = parts.styles.some(function (s) { return s.scoped; });
  var moduleId = 'data-v-' + genId(context.src, process.cwd(), options.hashKey);

  var output = '';
  var imports = [];

  var cssModules;
  var hasModules = false;
  var resolveStyle = function (style, index) {
    var moduleName = (style.module === true) ? '$style' : style.module;
    // setCssModule
    if (moduleName) {
      if (!cssModules) {
        cssModules = {};
      }
      if (!hasModules) {
        hasModules = true;
        output += 'var cssModules = {};\n';
      }
      if (moduleName in cssModules) {
        mutil.console.warn('CSS module name "' + moduleName + '" is not unique!');
      } else {
        cssModules[moduleName] = true;

        output += 'cssModules["' + moduleName + '"] = __VUE_STYLE_' + index + '__.modules;\n';
      }
    }
    return getPartImport('style', style, context, moduleId);
  };

  var scriptCode = function () {
    if(parts.script) {
      return getPartImport('script', parts.script, context)
        .then(function (scriptUrl) {
          imports.push(['__VUE_SCRIPT__', scriptUrl]);
        });
    } else {
      output += 'var __VUE_SCRIPT__ = null;\n';
    }
    return Promise.resolve();
  };

  var styleCode = function () {
    if (parts.styles.length) {
      output += '/* styles */\n';
      return Promise.all(parts.styles.map(resolveStyle))
        .then(function (styleUrls) {
          var styleImports = styleUrls.map(function (url, index) {
            return ['__VUE_STYLE_' + index + '__', url];
          });
          styleImports.forEach(function(item){
            output += item[0] + '.use();\n\n';
          });
          imports.push.apply(imports, styleImports);
        });
    }
  };

  var templateCode = function () {
    output += '/* template */\n';
    if (parts.template) {
      output += compileTemplate(context, parts.template, {
        id: moduleId,
        preserveWhitespace: options.preserveWhitespace
      }) + ';\n';
    } else {
      output += 'var __VUE_TEMPLATE__ = null;\n';
    }
  };

  var normalizeCode = function () {
    output += '/* normalizeComponent */\n';
    output += NORMALIZE_COMPONENT_CODE;
    output += 'var Component = normalizeComponent(\n';

    output += '/* script */\n';
    output += '__VUE_SCRIPT__,\n';

    output += '/* tempalte */\n';
    output += '__VUE_TEMPLATE__,\n';

    output += '  /* scopeId */\n  ';
    output += (hasScoped ? JSON.stringify(moduleId) : 'null') + ',\n';


    output += '  /* cssModules */\n  ';
    if (cssModules) {
      output += 'cssModules';
    } else {
      output += 'null';
    }
    output += '\n';

    output += ');\n';
  };

  var writeCode = function () {
    var importCode = imports.reduce(function (prev, item) {
      return prev + 'import ' + item[0] + ' from ' + JSON.stringify(item[1]) + ';\n';
    },'')
    var exportCode = 'export default (Component.exports);\n';
    var code = importCode + output + exportCode;
    context.contents = new Buffer(code);
  };

  scriptCode()
    .then(styleCode)
    .then(templateCode)
    .then(normalizeCode)
    .then(writeCode)
    .then(callback)
    .catch(callback);
};
