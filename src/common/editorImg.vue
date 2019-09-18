<template>
  <div
    :id="id"
    class="img-box"
    @mousedown="boxIdDown">
    <pot v-if="selectEle.findIndex(item => item.id === id) >= 0"></pot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pot from '../common/pot'
import { draw, down } from '../utils/util'

export default {
  props: ['id'],
  computed: mapState({
    existELeList: state => state.existELeList,
    selectEle: state => state.selectEle
  }),
  mounted () {
    draw(this.id, this)
  },
  methods: {
    boxIdDown (e) {
      this.$store.commit('changeSelectEle', [{
        id: this.id,
        type: 'img'
      }])
      down(e, this.id, this)
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
  border: 1px solid #000;
}
</style>
