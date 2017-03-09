# Vue 单文件

## 说明

*Vue 2.\* 版本的 parser，不支持1.*版本的 vue 单文件。*

参考Vue官方说明：http://cn.vuejs.org/guide/application.html


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

<style scoped>
  .box{
    background: red;
    width: 100px;
    height: 100px;
  }
</style>
```

## CSS Modules

支持与 `webpack-vue-loader` 相同的 `scoped style`，自动添加属性到节点上。

在 `style` 标签上添加 `module` 属性，即可在 vue 组件中使用 CSS Modules, 
可在组件内部通过 `this.$style` 来获取 modules。

```html
<template>
  <div :class="$style.box">
    <div :class="[$style.foo, $style.bar]"></div> 
  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    methods: {
      bz(){
        if ($(this.$el).hasClass(this.$style.box)) {
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

module可以命名：

```html
<template>
  <div :class="$foo.box"></div>
</template>

<style module="foo">
  .box{
    background: red;
  }
</style>
``` 


## 已知问题
- https://github.com/vuejs/vue-loader/issues/547 不支持2.1.4以下的vue版本
