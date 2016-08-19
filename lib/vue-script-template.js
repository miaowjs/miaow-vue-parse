var vueComponent = arguments[0] || {};
var vueTemplate = arguments[1];
var vueStyle = arguments[2];

// check if has no template but style appeared
if (!vueStyle && vueTemplate && vueTemplate.use) {
  vueStyle = vueTemplate;
  vueTemplate = null;
}

var mixin = {};
if (vueTemplate) {
  mixin.template = vueTemplate;
}

if (vueStyle) {
  mixin.created = function () {
    vueStyle.use();
    if(vueStyle.modules) {
      if (this._defineMeta) {
        // 0.12
        this._defineMeta('$styles', vueStyle.modules);
      } else {
        // 1.0
        var Vue = this.constructor;
        while (Vue.super) Vue = Vue.super;
        Vue.util.defineReactive(this, '$styles', vueStyle.modules);
      }
    }
  };

  mixin.destoryed = function () {
    vueStyle.unuse();
  };
}

if (typeof vueComponent === 'function') {
  var Vue = vueComponent;
  while (Vue.super) Vue = Vue.super;
  vueComponent.options = Vue.util.mergeOptions(vueComponent.options, mixin);
} else {
  vueComponent.mixins = vueComponent.mixins || [];
  vueComponent.mixins.unshift(mixin);
}

return vueComponent;
