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
      const res = this.isExit(['img1', 'font1', 'fontSilder'], e.clientX, e.clientY)
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
              const {t, l} = getLocated(obj)
              const width = obj.getBoundingClientRect().width
              const height = obj.getBoundingClientRect().height
              if (t > _t && (t + height) < (_t + _h) && l > _l && (l + width) < (_l + _w)) {
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
          const {l, t} = getLocated(obj)
          const width = obj.getBoundingClientRect().width
          const height = obj.getBoundingClientRect().height
          if (x > l && x < (l + width) && y > t && y < (t + height + 25)) {
            kaiguan = false
          }
        }
      }
      return kaiguan
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
