var parse5 = require('parse5');
var assign = require('lodash').assign;
var validateTemplate = require('vue-template-validator');
var deindent = require('de-indent');

function getAttribute(node, name) {
  if (node.attrs) {
    var i = node.attrs.length;
    var attr;
    while (i--) {
      attr = node.attrs[i];
      if (attr.name === name) {
        return attr.value;
      }
    }
  }
  return null;
}

module.exports = function (content, options) {
  var output = {
    template: null,
    style: null,
    script: null
  };

  var defaultLang = assign({
    script: 'es6',
    template: 'tpl',
    style: 'less'
  }, options.defaultLang);

  var fragment = parse5.parseFragment(content, {
    locationInfo: true
  });

  fragment.childNodes.forEach(function (node) {
    var type = node.tagName;
    var lang = getAttribute(node, 'lang');
    var src = getAttribute(node, 'src');
    var modulelarized = getAttribute(node, 'module') != null;
    var warnings = null;

    if (!Object.prototype.hasOwnProperty.call(output, type)) {
      return;
    }

    if (!lang) {
      lang = defaultLang[type];
    }

    // node count check
    if (output[type]) {
      throw new Error(
        '[miaow-vue-parse] Only one <script> or <template> or <style> tag is ' +
        'allowed inside a Vue component.'
      );
    }

    // handle src imports
    if (src) {
      if (type === 'style') {
        output.style = {
          src: src,
          lang: lang,
          modulelarized: modulelarized
        };
      } else if (type === 'template') {
        output.template = {
          src: src,
          lang: lang
        };
      } else if (type === 'script') {
        output.script = {
          src: src,
          lang: lang
        };
      }
      return;
    }

    // skip empty script/style tags
    if (type !== 'template' && (!node.childNodes || !node.childNodes.length)) {
      return;
    }

    // template content is nested inside the content fragment
    if (type === 'template') {
      node = node.content;
      if (!lang) {
        warnings = validateTemplate(node, content);
      }
    }

    // extract part
    var start = node.childNodes[0].__location.startOffset;
    var end = node.childNodes[node.childNodes.length - 1].__location.endOffset;
    var result = deindent(content.slice(start, end));

    output[type] = {
      lang: lang,
      modulelarized: modulelarized,
      content: result,
      warnings: warnings
    };
  });

  return output;
};

