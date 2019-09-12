<template>
  <div class="box">
    <div class="rotate">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSItNzE5MyA0MjM2IDQ0IDQ0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjM2EzYTNhOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsdGVyOiB1cmwoI2VsbGlwc2UtMTQpOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGZpbHRlciBpZD0iZWxsaXBzZS0xNCIgeD0iLTcxOTMiIHk9IjQyMzYiIHdpZHRoPSI0NCIgaGVpZ2h0PSI0NCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPGZlT2Zmc2V0IGR5PSIzIiBpbnB1dD0iU291cmNlQWxwaGEiLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgcmVzdWx0PSJibHVyIi8+CiAgICAgIDxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAuMTYxIi8+CiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8ZyBpZD0iR3JvdXBfMTY4IiBkYXRhLW5hbWU9Ikdyb3VwIDE2OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgwNzMgNDAwOCkiPgogICAgPGcgY2xhc3M9ImNscy0zIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCA4MDczLCAtNDAwOCkiPgogICAgICA8Y2lyY2xlIGlkPSJlbGxpcHNlLTE0LTIiIGRhdGEtbmFtZT0iZWxsaXBzZS0xNCIgY2xhc3M9ImNscy0xIiBjeD0iMTMiIGN5PSIxMyIgcj0iMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MTg0IDQyNDIpIi8+CiAgICA8L2c+CiAgICA8ZyBpZD0iZ3JvdXAtMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg5NS40OTIgMjQwLjMwNikiPgogICAgICA8ZyBpZD0iZ3JvdXAiPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBjbGFzcz0iY2xzLTIiIGQ9Ik0xMi44Myw4Ljg2N2E2LjYxNSw2LjYxNSwwLDEsMS0xLjc4NC03LjE2aDBMMTIuMzM3LjQxM2MuMjMtLjIzLjQxNi0uMTUzLjQxNS4xNzNMMTIuNzM5LDMuODZhLjYuNiwwLDAsMS0uNTkyLjU5MmwtMy4yNTYuMDA2Yy0uMzI2LDAtLjQtLjE4Ni0uMTczLS40MTZsMS4zMjctMS4zMjhBNS4xOTUsNS4xOTUsMCwxLDAsMTEuNSw4LjM2N2guMDA2YS43MDkuNzA5LDAsMSwxLDEuMzIxLjVaIi8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=">
    </div>
    <div class="draggable"></div>
    <div class="resizable">
      <span class="tl" draggable="true"></span>
      <span class="t" draggable="true"></span>
      <span class="tr" draggable="true"></span>
      <span class="r" draggable="true"></span>
      <span class="br" draggable="true"></span>
      <span class="b" draggable="true"></span>
      <span class="bl" draggable="true"></span>
      <span class="l" draggable="true"></span>
    </div>
  </div>
</template>
<script>
import transform from '../../utils/transform'
export default {
  data () {
    return {
      x: 0,
      y: 0,
      height: 200,
      width: 300,
      rotate: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init: function () {
      let box = document.querySelector('.box')
      let rotateHandler = document.querySelector('.rotate')
      let draggable = document.querySelector('.draggable')
      let resizeHandlers = Array.prototype.slice.call(document.querySelectorAll('.box span'), 0)
      this.draw(box)
      this.setCursorStyle(0)
      this.bindMoveEvents(draggable)
      this.bindRotateEvents(rotateHandler, box)
      resizeHandlers.map((handler) => {
        this.bindResizeEvents(handler)
      })
    },
    bindRotateEvents: function (node, box) {
      node.onmousedown = () => {
      // 旋转开始
        let event = window.event
        let point = this.getConterPoint(box)
        let prevAngle = Math.atan2(event.pageY - point.y, event.pageX - point.x) - this.rotate * Math.PI / 180
        document.onmousemove = () => {
          // 旋转
          let event = window.event
          let angle = Math.atan2(event.pageY - point.y, event.pageX - point.x)
          this.rotate = Math.floor((angle - prevAngle) * 180 / Math.PI)
          this.draw(box)
        }
        document.onmouseup = () => {
        // 旋转结束
          document.onmousemove = null
          document.onmouseup = null
          this.setCursorStyle(this.rotate)
        }
      }
      node.ondragstart = function (event) {
        event.preventDefault()
        return false
      }
    },
    bindResizeEvents: function (node) {
      node.onmousedown = () => {
        // 缩放开始
        let event = window.event
        event.preventDefault()
        let { x, y, width, height, rotate } = this
        let ex = event.pageX
        let ey = event.pageY
        // 计算初始状态旋转后的rect
        let transformedRect = transform({
          x,
          y,
          width,
          height
        }, rotate)
        // 取得旋转后的8点坐标
        let { point } = transformedRect

        // 获取当前点和对角线点
        let pointAndOpposite = this.getPointAndOpposite(point, ex, ey)

        let { opposite } = pointAndOpposite
        // 对角线点的索引即为缩放基点索引
        let baseIndex = opposite.index
        let oppositeX = opposite.point.x
        let oppositeY = opposite.point.y

        // 鼠标释放点距离当前点对角线点的偏移量
        let offsetWidth = Math.abs(ex - oppositeX)
        let offsetHeight = Math.abs(ey - oppositeY)

        // 记录最原始的状态
        let oPoint = {
          x,
          y,
          width,
          height,
          rotate
        }

        document.onmousemove = () => {
          let event = window.event
          let nex = event.pageX
          let ney = event.pageY
          let scale = {
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

          let newRect = this.getNewRect(oPoint, scale, transformedRect, baseIndex)
          this.x = newRect.x
          this.y = newRect.y
          this.width = newRect.width
          this.height = newRect.height
          let box = document.querySelector('.box')
          this.draw(box)
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    },
    getConterPoint: function (box) {
      return {
        x: box.offsetLeft + box.offsetWidth / 2,
        y: box.offsetTop + box.offsetHeight / 2
      }
    },
    getPointAndOpposite: function (point, ex, ey) {
      let oppositePoint = {}
      let currentPoint = {}

      let minDelta = 1000
      let currentIndex = 0
      let oppositeIndex = 0

      point.forEach((p, index) => {
        const delta = Math.sqrt(Math.pow(this.x - ex, 2) + Math.pow(this.y - ey, 2))
        if (delta < minDelta) {
          currentPoint = p
          currentIndex = index
          minDelta = delta
          // 对角线点index相差4
          let offset = 4
          let oIndex = index - offset
          if (oIndex < 0) {
            oIndex = index + offset
          }
          // 取对角线点坐标
          oppositePoint = point.slice(oIndex, oIndex + 1)[0]
          oppositeIndex = oIndex
        }
      })

      return {
        current: {
          index: currentIndex,
          point: currentPoint
        },
        opposite: {
          index: oppositeIndex,
          point: oppositePoint
        }
      }
    },
    getNewRect: function (oPoint, scale, oTransformedRect, baseIndex) {
      let scaledRect = this.getScaledRect({
        x: oPoint.x,
        y: oPoint.y,
        width: oPoint.width,
        height: oPoint.height,
        scale: scale
      })
      let transformedRotateRect = transform(scaledRect, oPoint.rotate)
      // 计算到平移后的新坐标
      let translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left
      let translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top

      // 计算平移后元素左上角的坐标
      let newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2
      let newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2

      // 缩放后元素的高宽
      let newWidth = scaledRect.width
      let newHeight = scaledRect.height

      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }
    },
    bindMoveEvents: function (box) {
      box.onmousedown = () => {
        let event = window.event
        let deltaX = event.pageX - this.x
        let deltaY = event.pageY - this.y
        document.onmousemove = () => {
          let event = window.event
          this.x = event.pageX - deltaX
          this.y = event.pageY - deltaY
          this.draw(box)
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
      box.ondragstart = function (event) {
        event.preventDefault()
        return false
      }
    },
    draw: function (box) {
      this.css(box, {
        left: this.x + 'px',
        top: this.y + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        transform: 'rotate(' + this.rotate + 'deg)'
      })
    },
    setCursorStyle: function (degree) {
      let top = document.querySelector('.t')
      let topRight = document.querySelector('.tr')
      let right = document.querySelector('.r')
      let bottomRight = document.querySelector('.br')
      let bottom = document.querySelector('.b')
      let bottomLeft = document.querySelector('.bl')
      let left = document.querySelector('.l')
      let topLeft = document.querySelector('.tl')
      let cursorStyle = this.getNewCursorArray(degree)
      this.css(top, { 'cursor': cursorStyle[0] })
      this.css(topRight, { 'cursor': cursorStyle[1] })
      this.css(right, { 'cursor': cursorStyle[2] })
      this.css(bottomRight, { 'cursor': cursorStyle[3] })
      this.css(bottom, { 'cursor': cursorStyle[4] })
      this.css(bottomLeft, { 'cursor': cursorStyle[5] })
      this.css(left, { 'cursor': cursorStyle[6] })
      this.css(topLeft, { 'cursor': cursorStyle[7] })
    },
    getNewCursorArray: function (degree) {
      const cursorStyleArray = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize']
      const ARR_LENGTH = 8
      const STEP = 45
      let startIndex = 0
      if (degree) {
        startIndex = Math.floor(degree / STEP)
        if (degree % STEP > (STEP / 2)) {
          startIndex += 1
        }
      }

      if (startIndex > 1) {
        const len = ARR_LENGTH - startIndex
        return (cursorStyleArray.slice(startIndex, startIndex + len))
          .concat(cursorStyleArray.slice(0, startIndex))
      }

      return cursorStyleArray
    },
    css: function (node, ops) {
      for (let index in ops) {
        node['style'][index] = ops[index]
      }
    },
    getScaledRect: function (params, baseIndex) {
      let { x, y, width, height, scale } = params
      let offset = {
        x: 0,
        y: 0
      }
      let deltaXScale = scale.x - 1
      let deltaYScale = scale.y - 1
      let deltaWidth = width * deltaXScale
      let deltaHeight = height * deltaYScale
      let newWidth = width + deltaWidth
      let newHeight = height + deltaHeight
      let newX = x - deltaWidth / 2
      let newY = y - deltaHeight / 2
      if (baseIndex) {
        let points = [{x, y}, {x: x + width, y}, {x: x + width, y: y + height}, {x, y: y + height}]
        let newPoints = [{x: newX, y: newY}, {x: newX + newWidth, y: newY}, {x: newX + newWidth, y: newY + newHeight}, {x: newX, y: newY + newHeight}]
        offset.x = points[baseIndex].x - newPoints[baseIndex].x
        offset.y = points[baseIndex].y - newPoints[baseIndex].y
      }
      return {
        x: newX + offset.x,
        y: newY + offset.y,
        width: newWidth,
        height: newHeight
      }
    }
  }
}
</script>
<style scoped>
.box {
  background: orange;
  position: absolute;
  user-select: none;
}
.box .draggable {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.box .rotate {
  width: 40px;
  height: 40px;
  position: absolute;
  top: -40px;
  left: 50%;
  margin-left: -15px;
}
.box .rotate img{
  width: 100%;
  height: 100%;
}
.box .resizable > span {
  width: 10px;
  height: 10px;
  position: absolute;
  border: 1px solid #f00;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}
.tl {
  top: -5px;
  left: -5px;
}
.t {
  top: -5px;
  left: 50%;
  margin-left: -5px;
}
.tr {
  top: -5px;
  right: -5px;
}
.r {
  top: 50%;
  margin-top: -5px;
  right: -5px;
}
.br {
  bottom: -5px;
  right: -5px;
}
.b {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
}
.bl {
  bottom: -5px;
  left: -5px;
}
.l {
  left: -5px;
  top: 50%;
  margin-top: -5px;
}
</style>
