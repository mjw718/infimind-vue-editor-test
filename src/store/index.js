import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Store = new Vuex.Store({
  state: {
    allowOperaId: [],
    fontFamily: 'Helvetica',
    fontSize: 14,
    colorVal: '#000',
    operaType: '',
    // 存在的元素列表
    existELeList: []
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
    },
    addEle (state, par) {
      if (state.existELeList.length === 0) {
        state.existELeList.push(par)
      } else {
        let index1 = -1
        for (let index = 0; index < state.existELeList.length; index++) {
          const element = state.existELeList[index]
          if (element.id === par.id) {
            index1 = index
          }
        }
        if (index1 >= 0) {
          state.existELeList[index1].locate = par.locate
        } else {
          state.existELeList.push(par)
        }
      }
    }
  }
})

export default Store
