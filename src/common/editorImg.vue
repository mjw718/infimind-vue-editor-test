<template>
  <div
    :id="id"
    class="img-box"
    :style="{'border':`${allowOperaId.indexOf(id) !== -1 ? '1px solid red' : ''}`}"
    @mousedown="boxIdDown">
    <pot></pot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import down from '../utils/down'
import pot from '../common/pot'
export default {
  data () {
    return {
    }
  },
  props: ['id'],
  computed: mapState({
    allowOperaId: state => state.allowOperaId
  }),
  methods: {
    boxIdDown (e) {
      this.$store.commit('toOpera', {
        arr: [this.id],
        type: 'img'
      })
      down(e, this.id)
    }
  },
  components: {
    pot
  }
}
</script>

<style scoped>
.img-box {
  position: absolute;
  top: 10px;
  left: 10px;

  width: 100px;
  height: 100px;
  background-image: url('../../public/test.png');
  background-repeat : no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}
</style>
