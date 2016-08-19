<script>
  export default {
    template: `
      <div :class="[$styles.box, $styles.a, clicked ? $styles.cc : '']" @click.prevent="clicked=!clicked">
      </div>
    `,

    data: function(){
      return {
        clicked: false
      }
    }
  };
</script>

<style module>
  .box.a{
    background: blue;
    width: 100px;
    height: 100px;
  }
  .box.a.cc{
    background: yellow;
  }
</style>
