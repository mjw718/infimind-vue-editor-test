<template>
    <div
        :id = 'id'
        class="font-container"
        @mousedown="isDown"
    >
      <div class="font-box">
        <div
          id="font-content"
          class="font-content"
          :style="{fontSize: fontSize + 'px', fontFamily: fontFamily, color: colorVal}"
        >
          <input v-if="showInput" type="text" @keydown="showText" v-model="msg" />
          <span v-else @dblclick="toShowInput">{{msg}}</span>
        </div>
        <pot v-if="selectEle.findIndex(item => item.id === id) >= 0"></pot>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import pot from '../common/pot'
import { draw, down } from '../utils/util'

export default {
  data () {
    return {
      msg: '你好',
      showInput: false
    }
  },
  props: ['id'],
  computed: mapState({
    fontFamily: state => state.fontFamily,
    fontSize: state => state.fontSize,
    colorVal: state => state.colorVal,
    existELeList: state => state.existELeList,
    selectEle: state => state.selectEle
  }),
  mounted () {
    draw(this.id, this)
  },
  methods: {
    isDown: function (e) {
      this.$store.commit('changeSelectEle', [{
        id: this.id,
        type: 'text'
      }])
      down(e, this.id, this)
    },
    toShowInput: function (params) {
      this.showInput = true
    },
    showText: function (e) {
      if (e && e.keyCode === 13) {
        // enter 键
        this.showInput = false
      }
    }
  },
  components: {
    pot
  }
}
</script>

<style scoped>
.font-container {
  position: absolute;
  z-index: 1;
  border: 1px solid #000;
}

.font-box {
  position: relative;
  width: 100%;
  height: 100%;
}
.font-box .font-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  z-index: 10;
}
.pot-box {
  width: 100%;
  height: 100%;
}
</style>
