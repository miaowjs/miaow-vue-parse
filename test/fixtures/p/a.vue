<template>
<div :class="$style.box">
  <span>{{a+b}}</span>
  <my-b>
    <template scope="p">
      <div :class="$style.boo">{{p.s}}</div>
    </template>
  </my-b>
</div>
</template>

<script>
  import B from './b.vue';

  export default {
    data: ()=>{
      return {
        a: 1,
        b: 2
      };
    },
    components: {
      'my-b': B
    }
  }
</script>

<style src="./a.less" module></style>
