<template>
  <div id='box'>
    <silder v-if="operaType === 'text'"></silder>
    <div class="container" id="container">
      <editor-img id='img1'></editor-img>
      <!-- <editor-img id='img2'></editor-img> -->
      <editor-font id='font1'></editor-font>
    </div>
    <div id="operate-wrapper" class="operate-wrapper" v-if="this.allowOperaId.length > 1">
      <el-button type="primary" @click="toGroup">成组</el-button>
    </div>
    <pot id='backPot' style="display: none"></pot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getLocated from '../../utils/getLocated'
import editorImg from '../../common/editorImg'
import editorFont from '../../common/editorFont'
import silder from '../../components/index/silder'
import { transformFunction } from '../../utils/util'
import pot from '../../common/pot'
export default {
  data () {
    return {
      eleList: ['img1', 'font1', 'fontSilder']
    }
  },
  computed: mapState({
    allowOperaId: state => state.allowOperaId,
    operaType: state => state.operaType
  }),
  components: {
    editorImg,
    editorFont,
    silder,
    pot
  },
  created () {
    this.$store.commit('addEle', {
      id: 'img1',
      locate: {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
        rotate: 0
      }
    })
    this.$store.commit('addEle', {
      id: 'font1',
      locate: {
        x: 100,
        y: 0,
        height: 100,
        width: 100,
        rotate: 0
      }
    })
  },
  mounted () {
    // 框选相关
    document.getElementById('box').onmousedown = (e) => {
      const res = this.isExit([...this.eleList, 'rotate-ele', 'operate-wrapper'], e.clientX, e.clientY)
      if (!res) {
        return
      }
      let isSelect = true
      let startX = e.clientX
      let startY = e.clientY

      let selDiv = document.createElement('div')
      selDiv.style.cssText = 'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;'
      selDiv.id = 'selectDiv'
      document.body.appendChild(selDiv)
      selDiv.style.left = startX + 'px'
      selDiv.style.top = startY + 'px'

      let selectEle = []

      document.onmousemove = (e) => {
        if (isSelect) {
          if (selDiv.style.display === 'none') {
            selDiv.style.display = ''
          }
          const _x = e.clientX
          const _y = e.clientY
          selDiv.style.left = Math.min(_x, startX) + 'px'
          selDiv.style.top = Math.min(_y, startY) + 'px'
          selDiv.style.width = Math.abs(_x - startX) + 'px'
          selDiv.style.height = Math.abs(_y - startY) + 'px'

          const arr = this.eleList
          let selected = []

          const _l = selDiv.offsetLeft
          const _t = selDiv.offsetTop
          const _w = selDiv.offsetWidth
          const _h = selDiv.offsetHeight

          for (let i = 0; i < arr.length; i++) {
            const obj = document.getElementById(arr[i])
            if (obj) {
              const {minX, maxX, minY, maxY} = this.getXY(obj)
              if (!(maxY < _t || minY > (_t + _h)) && !(maxX < _l || minX > (_l + _w))) {
                selected.push(arr[i])
              }
            }
          }
          selectEle = selected
        }
      }
      document.onmouseup = () => {
        isSelect = false
        if (selDiv) {
          this.$store.commit('toOpera', {
            arr: selectEle,
            type: ''
          })
          document.body.removeChild(selDiv)
        }
      }
    }
  },
  methods: {
    isExit: function (arr, x, y) {
      let kaiguan = true
      for (let i = 0; i < arr.length; i++) {
        const obj = document.getElementById(arr[i])
        if (obj) {
          const {minX, maxX, minY, maxY} = this.getXY(obj)
          if (x > minX && x < maxX + 25 && y > minY && y < maxY + 25) {
            kaiguan = false
          }
        }
      }
      return kaiguan
    },
    getXY: function (obj) {
      const container = getLocated(obj.parentNode)
      const sty = window.getComputedStyle(obj, null)
      const tr = sty.getPropertyValue('-webkit-transform') ||
        sty.getPropertyValue('-moz-transform') ||
        sty.getPropertyValue('-ms-transform') ||
        sty.getPropertyValue('-o-transform') ||
        sty.getPropertyValue('transform') ||
        'FAIL'
      let angle = 0
      if (tr && tr !== 'none') {
        let values = tr.split('(')[1].split(')')[0].split(',')
        let a = values[0]
        let b = values[1]
        angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
      }
      const width = obj.getBoundingClientRect().width
      const height = obj.getBoundingClientRect().height
      const transformedRect = transformFunction({
        x: obj.offsetLeft,
        y: obj.offsetTop,
        width,
        height
      }, angle)
      const { point } = transformedRect
      const xList = point.map(item => item.x)
      const minX = Math.min(...xList) + container.l
      const maxX = Math.max(...xList) + container.l

      const yList = point.map(item => item.y)
      const minY = Math.min(...yList) + container.t
      const maxY = Math.max(...yList) + container.t

      return {minX, maxX, minY, maxY, point}
    },
    // 成组
    toGroup: function () {
      const domList = []
      let minXList = []
      let maxXList = []
      let minYList = []
      let maxYList = []
      for (let index = 0; index < this.allowOperaId.length; index++) {
        const element = this.allowOperaId[index]
        const obj = document.getElementById(element)

        const point = this.getXY(obj).point
        const xList = point.map(item => item.x)
        const minX = Math.min(...xList)
        const maxX = Math.max(...xList)
        const yList = point.map(item => item.y)
        const minY = Math.min(...yList)
        const maxY = Math.max(...yList)
        minXList.push(minX)
        maxXList.push(maxX)
        minYList.push(minY)
        maxYList.push(maxY)
        const newDom = obj.cloneNode(true)
        domList.push(newDom)
        obj.parentNode.removeChild(obj)
      }
      const container = document.getElementById('container')

      let newdiv = document.createElement('div')
      newdiv.id = 'div1'
      const width = Math.max(...maxXList) - Math.min(...minXList)
      const height = Math.max(...maxYList) - Math.min(...minYList)
      const top = Math.min(...minYList)
      const left = Math.min(...minXList)

      newdiv.style.width = `${width}px`
      newdiv.style.height = `${height}px`
      newdiv.style.position = 'absolute'
      newdiv.style.left = `${left}px`
      newdiv.style.top = `${top}px`
      newdiv.style.border = `1px solid red`
      container.appendChild(newdiv)

      const backPot = document.getElementById('backPot')
      backPot.style.display = 'block'
      newdiv.appendChild(backPot)

      domList.forEach(element => {
        element.style.left = `${JSON.parse(element.style.left.split('px')[0]) - left}px`
        element.style.top = `${JSON.parse(element.style.top.split('px')[0]) - top}px`
        newdiv.appendChild(element)
      })
    }
  }
}
</script>

<style scoped>
#box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.container {
  width: 50%;
  height: 100%;
  background-color: #fff;
  position: relative;
  z-index: 100;
  overflow: hidden;
}
.operate-wrapper {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
