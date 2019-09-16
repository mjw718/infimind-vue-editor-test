<template>
  <div
    :id="id"
    class="img-box"
    :style="{'border':`${allowOperaId.indexOf(id) !== -1 ? '1px solid red' : ''}`}"
    @mousedown="boxIdDown">
    <pot></pot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pot from '../common/pot'
import getLocated from '../utils/getLocated'
import { getPointAndOpposite, getNewRect, transformFunction } from '../utils/util'

export default {
  data () {
    return {
      x: 0,
      y: 0,
      height: 100,
      width: 100,
      rotate: 0
    }
  },
  props: ['id'],
  computed: mapState({
    allowOperaId: state => state.allowOperaId
  }),
  mounted () {
    const box = document.getElementById(this.id)
    this.draw(box)
  },
  methods: {
    boxIdDown (e) {
      this.$store.commit('toOpera', {
        arr: [this.id],
        type: 'img'
      })
      this.down(e, this.id)
    },
    down (e, id) {
      const box = document.getElementById(id)
      const targetId = e.target.id

      const containerBox = document.getElementById('container')
      const container = getLocated(containerBox)
      const containerX = container.l
      const containerY = container.t

      if (targetId === 'rotate-ele') { // 旋转
        // 获取初始角度
        const point = getLocated(box)
        const width = box.getBoundingClientRect().width
        const height = box.getBoundingClientRect().height
        const initAngle = Math.atan2(e.pageY - (point.t + height / 2), e.pageX - (point.l + width / 2)) - this.rotate * Math.PI / 180

        document.onmousemove = () => {
          // 旋转开始
          const e = window.event
          const angle = Math.atan2(e.pageY - (point.t + height / 2), e.pageX - (point.l + width / 2))
          this.rotate = Math.floor((angle - initAngle) * 180 / Math.PI)
          this.draw(box)
        }
      } else if (e.target.nodeName.toLowerCase() === 'i') { // 缩放
        const ex = e.pageX - containerX
        const ey = e.pageY - containerY
        // 计算初始状态旋转后的rect
        const transformedRect = transformFunction({
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height
        }, this.rotate)
        // 取得旋转后的8点坐标
        const { point } = transformedRect

        // 获取当前点和对角线点
        const pointAndOpposite = getPointAndOpposite(point, ex, ey)
        const { opposite } = pointAndOpposite

        // 对角线点的索引即为缩放基点索引
        const baseIndex = opposite.index
        const oppositeX = opposite.point.x
        const oppositeY = opposite.point.y

        // 鼠标释放点距离当前点对角线点的偏移量
        const offsetWidth = Math.abs(ex - oppositeX)
        const offsetHeight = Math.abs(ey - oppositeY)

        // 记录最原始的状态
        const oPoint = {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          rotate: this.rotate
        }

        document.onmousemove = () => {
          const event = window.event
          const nex = event.pageX - containerX
          const ney = event.pageY - containerY
          const scale = {
            x: 1,
            y: 1
          }
          let realScale = 1

          // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
          if (offsetWidth > offsetHeight) {
            realScale = Math.abs(nex - oppositeX) / offsetWidth
          } else {
            realScale = Math.abs(ney - oppositeY) / offsetHeight
          }
          if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
            scale.x = scale.y = realScale
          } else if ([1, 5].indexOf(baseIndex) >= 0) {
            scale.y = realScale
          } else if ([3, 7].indexOf(baseIndex) >= 0) {
            scale.x = realScale
          }

          const newRect = getNewRect(oPoint, scale, transformedRect, baseIndex)
          this.x = newRect.x
          this.y = newRect.y
          this.width = newRect.width
          this.height = newRect.height
          this.draw(box)
        }
      } else { // 移动
        const event = window.event
        const deltaX = event.pageX - containerX - this.x
        const deltaY = event.pageY - containerY - this.y

        document.onmousemove = (e) => {
          this.x = e.pageX - containerX - deltaX
          this.y = e.pageY - containerY - deltaY
          this.draw(box)
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    draw (node) {
      const ops = {
        left: this.x + 'px',
        top: this.y + 'px',
        height: this.height + 'px',
        width: this.width + 'px',
        transform: 'rotate(' + this.rotate + 'deg)'
      }
      for (var index in ops) {
        node['style'][index] = ops[index]
      }
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
}
</style>
