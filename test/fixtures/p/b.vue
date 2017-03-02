<template>
  <div class="box a" :class="[clicked ? 'cc' : '']" @click.prevent="clicked=!clicked">
    <div class="test">aa</div>
    <my-c></my-c>
    <slot :s="clicked"></slot>
  </div>
</template>
<script>
  import C from './c.vue';

  export default {
    components: {
      'my-c': C
    },
    data: function(){
      return {
        clicked: false
      }
    }
  };
</script>

<style scoped>
  .box.a{
    background: blue;
    width: 100px;
    height: 100px;
  }
  .box.a.cc{
    background: yellow;
  }
  .box .test{
    background: pink;
  }
</style>
