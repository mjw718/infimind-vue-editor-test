<template>
    <div
        :id = 'id'
        class="font-container"
        :style="{'border':`${allowOperaId.indexOf(id) !== -1 ? '1px solid red' : ''}`}"
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
        <pot></pot>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import down from '../utils/down'
import pot from '../common/pot'
export default {
  data () {
    return {
      msg: '你好',
      showInput: false
    }
  },
  props: ['id'],
  computed: mapState({
    allowOperaId: state => state.allowOperaId,
    fontFamily: state => state.fontFamily,
    fontSize: state => state.fontSize,
    colorVal: state => state.colorVal
  }),
  methods: {
    isDown: function (e) {
      this.$store.commit('toOpera', {
        arr: [this.id],
        type: 'text'
      })
      down(e, this.id)
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
  top: 250px;
  left: 150px;

  width: 150px;
  height: 100px;
  z-index: 1;
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
