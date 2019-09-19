<template>
  <div id='box'>
    <silder v-if="selectEle.length === 1 && selectEle[0].type === 'text'"></silder>
    <div class="container" id="container">
      <editor-img id='img1'></editor-img>
      <!-- <editor-img id='img2'></editor-img> -->
      <editor-font id='font1'></editor-font>
    </div>
    <div id="operate-wrapper" class="operate-wrapper">
      <el-button type="primary" v-if="selectEle.length > 1" @click="toGroup">成组</el-button>
      <el-button type="primary" v-if="selectEle.length ===1 && selectEle[0].isGroup" @click="cancelGroup">取消成组</el-button>
    </div>
    <pot id='backPot' v-show="selectEle.length === 1 && selectEle[0].id === 'div1'"></pot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getLocated from '../../utils/getLocated'
import editorImg from '../../common/editorImg'
import editorFont from '../../common/editorFont'
import silder from '../../components/index/silder'
import { transformFunction, down, draw } from '../../utils/util'
import pot from '../../common/pot'
export default {
  data () {
    return {
      eleList: ['img1', 'font1', 'fontSilder']
    }
  },
  computed: mapState({
    existELeList: state => state.existELeList,
    selectEle: state => state.selectEle
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
      const res = this.isExit([...this.eleList, 'rotate-ele', 'operate-wrapper', 'div1'], e.clientX, e.clientY)
      if (!res) {
        return
      }
      this.$store.commit('changeSelectEle', [])
      let isSelect = true
      let startX = e.clientX
      let startY = e.clientY

      let selDiv = document.createElement('div')
      selDiv.style.cssText = 'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;'
      selDiv.id = 'selectDiv'
      document.body.appendChild(selDiv)
      selDiv.style.left = startX + 'px'
      selDiv.style.top = startY + 'px'

      let selectEleList = []

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
          selectEleList = selected
        }
      }
      document.onmouseup = () => {
        if (selDiv && isSelect) {
          const list = selectEleList.map(li => {
            return {
              id: li,
              type: ''
            }
          })
          this.$store.commit('changeSelectEle', list)
          if (selDiv.parentNode) {
            selDiv.parentNode.removeChild(selDiv)
          }
        }
        isSelect = false
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
    getAngle: function (obj) {
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
      return angle
    },
    getXY: function (obj) {
      const container = getLocated(obj.parentNode)
      let angle = this.getAngle(obj)
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
      const selectEleList = JSON.parse(JSON.stringify(this.selectEle))
      this.$store.commit('changeSelectEle', [{
        id: '',
        type: ''
      }])
      const domList = []
      let minXList = []
      let maxXList = []
      let minYList = []
      let maxYList = []
      for (let index = 0; index < selectEleList.length; index++) {
        const element = selectEleList[index].id
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
        domList.push(obj)
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
      newdiv.style.border = `1px solid #000`
      container.appendChild(newdiv)
      this.$store.commit('addEle', {
        id: 'div1',
        locate: {
          x: left,
          y: top,
          height: height,
          width: width,
          rotate: 0
        }
      })
      const backPot = document.getElementById('backPot')
      newdiv.appendChild(backPot)

      domList.forEach(element => {
        element.style.left = `${(JSON.parse(element.style.left.split('px')[0]) - left) / width * 100}%`
        element.style.top = `${(JSON.parse(element.style.top.split('px')[0]) - top) / height * 100}%`

        element.style.width = `${JSON.parse(element.style.width.split('px')[0]) / width * 100}%`
        element.style.height = `${JSON.parse(element.style.height.split('px')[0]) / height * 100}%`
        newdiv.appendChild(element)
      })
      document.getElementById('div1').onmousedown = (e) => {
        const childEle = domList.map(item => item.id)
        // e.stopPropagation()
        this.$store.commit('changeSelectEle', [{
          id: 'div1',
          type: '',
          isGroup: true,
          childEle
        }])
        down(e, 'div1', this)
      }
    },
    // // 获取中心点
    // getCenter: function (obj, width, height) {
    //   const transformedRect = transformFunction({
    //     x: obj.offsetLeft,
    //     y: obj.offsetTop,
    //     width,
    //     height
    //   }, this.getAngle(obj))
    //   console.log(transformedRect)
    //   const xList = transformedRect.point.map(item => item.x)
    //   const x = this.sum(xList) / 8
    //   const yList = transformedRect.point.map(item => item.y)
    //   const y = this.sum(yList) / 8
    //   return {x, y}
    // },
    // 取消分组
    cancelGroup: function () {
      const ele = this.selectEle[0]
      const currentId = ele.id
      const currentNode = document.getElementById(currentId)
      const parentNode = currentNode.parentNode
      const childDomList = ele.childEle.map(item => document.getElementById(item))
      const currentAngle = this.getAngle(currentNode)

      const currentNodeWidth = currentNode.style.width.split('px')[0]
      const currentNodeHeight = currentNode.style.height.split('px')[0]
      const currentNodeLeft = currentNode.style.left.split('px')[0]
      const currentNodeTop = currentNode.style.top.split('px')[0]

      childDomList.forEach(item => {
        const itemWidth = item.style.width.split('%')[0] / 100 * currentNodeWidth
        const itemHeight = item.style.height.split('%')[0] / 100 * currentNodeHeight
        const itemLeft = JSON.parse(item.style.left.split('%')[0] / 100 * currentNodeWidth) + JSON.parse(currentNodeLeft)
        const itemTop = JSON.parse(item.style.top.split('%')[0] / 100 * currentNodeHeight) + JSON.parse(currentNodeTop)

        this.$store.commit('addEle', {
          id: item.id,
          locate: {
            x: itemLeft,
            y: itemTop,
            height: itemHeight,
            width: itemWidth,
            rotate: currentAngle + this.existELeList.find(ele => ele.id === item.id).locate.rotate
          }
        })
        parentNode.appendChild(item)
        draw(item.id, this)
      })
      this.$store.commit('changeSelectEle', [])
      const backPot = document.getElementById('backPot')
      parentNode.appendChild(backPot)
      parentNode.removeChild(currentNode)
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
#backPot {
  z-index: 2;
}
</style>
