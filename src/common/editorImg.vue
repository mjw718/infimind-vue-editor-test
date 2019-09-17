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
import pot from '../common/pot'
import { draw, down } from '../utils/util'

export default {
  props: ['id'],
  computed: mapState({
    allowOperaId: state => state.allowOperaId,
    existELeList: state => state.existELeList
  }),
  mounted () {
    draw(this)
  },
  methods: {
    boxIdDown (e) {
      this.$store.commit('toOpera', {
        arr: [this.id],
        type: 'img'
      })
      down(e, this)
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
  background-image: url('../../public/test.png');
  background-repeat : no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}
</style>
