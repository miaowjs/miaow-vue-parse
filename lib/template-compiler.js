var compiler = require('vue-template-compiler');
var transpile = require('vue-template-es2015-compiler')
var mutil = require('miaow-util');


function toFunction(code) {
  return 'function (){' + code + '}';
}

function pad(html) {
  return html.split(/\r?\n/).map(line => `  ${line}`).join('\n');
}

module.exports = function (context, part, options) {
  var html = part.content;
  var compiled = compiler.compile(html, options);

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      mutil.console.warn(tip);
    });
  }

  var code;
  if (compiled.errors && compiled.errors.length) {
    mutil.console.warn(
      `\n  Error compiling template:\n\n  [file]: ${part.src || context.src}\n${pad(html)}\n` +
      compiled.errors.map(e => `  - ${e}`).join('\n') + '\n'
    );
    code = '{render:function(){},staticRenderFns:[]}';
  } else {
    code = transpile('module.exports={' +
      'render:' + toFunction(compiled.render) + ',' +
      'staticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + ']' +
    '}');
  }
  return code;
};

