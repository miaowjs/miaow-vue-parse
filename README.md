# Vue 单文件

## 说明

可参考Vue官方说明：http://cn.vuejs.org/guide/application.html

每个 `.vue` 文件包含 3 部分，`script`、`template` 和 `style`，template 和 style 部分可以省略.
style 部分默认语言为 `less`, script 部分默认语言为 `es6` 。


```html
<template>
  <div class="box">
    <span>{{a+b}}</span>
    <my-comp></my-comp>
  </div>
</template>

<script>
  import B from './b.vue';
  export default {
    data(){
      return {
        a: 1,
        b: 2
      };
    },
    components: {
      'my-comp': B
    }
  }
</script>

<style>
  .box{
    background: red;
    width: 100px;
    height: 100px;
  }
</style>
```

## src 引入方式

```html
<template src="./template.html"></template>
<script src="./script.js"></script>
<style src="./style.less"></style>
```

## CSS Modules
在 `style` 标签上添加 `module` 属性，即可在 vue 组件中使用 CSS Modules, 
可在组件内部通过 `this.$styles` 来获取 modules。

```html
<template>
  <div :class="$styles.box">
    <div :class="[$styles.foo, $styles.bar]"></div> 
  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    methods: {
      bz(){
        if ($(this.$el).hasClass(this.$styles.box)) {
          //...
        }
      }
    }
  }
</script>

<style module>
  .box{
    background: red;

  }
  .foo.bar{
    width: 100px;
    height: 100px;
  }
</style>
```

## 与 vue-loader 的差异

+ template 不支持 lang
+ script 与 style 的 lang 依赖于 miaow 带的其他 parser 的支持
+ 不支持 Scoped CSS, 使用 miaow 支持的 CSS Modules 代替
