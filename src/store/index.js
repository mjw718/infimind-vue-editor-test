import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Store = new Vuex.Store({
  state: {
    // 元素选中相关
    selectEle: [],
    // 文本变化相关
    fontFamily: 'Helvetica',
    fontSize: 14,
    colorVal: '#000',
    // 存在的元素列表
    existELeList: []
  },
  mutations: {
    changeSelectEle (state, par) {
      state.selectEle = par
    },
    // 文本变化相关
    changeFontFamily (state, obj) {
      state.fontFamily = obj.value
    },
    changeFontSize (state, num) {
      state.fontSize = num
    },
    changeColor (state, val) {
      state.colorVal = val
    },
    // 向元素列表中添加元素
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
