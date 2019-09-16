<template>
  <div id='box'>
    <silder v-if="operaType === 'text'"></silder>
    <div class="container" id="container">
      <editor-img id='img1'></editor-img>
      <!-- <editor-img id='img2'></editor-img> -->
      <editor-font id='font1'></editor-font>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getLocated from '../../utils/getLocated'
import editorImg from '../../common/editorImg'
import editorFont from '../../common/editorFont'
import silder from '../../components/index/silder'
import { transformFunction } from '../../utils/util'
export default {
  computed: mapState({
    allowOperaId: state => state.allowOperaId,
    operaType: state => state.operaType
  }),
  components: {
    editorImg,
    editorFont,
    silder
  },
  mounted () {
    document.getElementById('box').onmousedown = (e) => {
      const res = this.isExit(['img1', 'font1', 'fontSilder', 'rotate-ele'], e.clientX, e.clientY)
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

          const arr = ['img1', 'font1', 'fontSilder']
          let selected = []

          const _l = selDiv.offsetLeft
          const _t = selDiv.offsetTop
          const _w = selDiv.offsetWidth
          const _h = selDiv.offsetHeight

          for (let i = 0; i < arr.length; i++) {
            const obj = document.getElementById(arr[i])
            if (obj) {
              const {minX, maxX, minY, maxY} = this.getXY(obj)
              if (minY > _t && maxY < (_t + _h) && minX > _l && maxX < (_l + _w)) {
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
      const container = getLocated(document.getElementById('container'))
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

      return {minX, maxX, minY, maxY}
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
</style>
