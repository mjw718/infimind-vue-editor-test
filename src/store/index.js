import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Store = new Vuex.Store({
  state: {
    allowOperaId: [],
    fontFamily: 'Helvetica',
    fontSize: 14,
    colorVal: '#000',
    operaType: ''
  },
  mutations: {
    toOpera (state, obj) {
      state.allowOperaId = obj.arr
      state.operaType = obj.type
    },
    changeFontFamily (state, obj) {
      state.fontFamily = obj.value
    },
    changeFontSize (state, num) {
      state.fontSize = num
    },
    changeColor (state, val) {
      state.colorVal = val
    }
  }
})

export default Store
