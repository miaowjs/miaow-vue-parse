<script>
import D from './d.vue';

export default {
  render (h){
    return h('div', {staticClass:'test'}, [h(D, 'render function!')]);
  }
};
</script>
<style scoped>
  .test{
    color: blue;
  }
</style>
