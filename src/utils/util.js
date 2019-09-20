function getPointAndOpposite (point, ex, ey) {
  let oppositePoint = {}
  let currentPoint = {}

  let minDelta = 1000
  let currentIndex = 0
  let oppositeIndex = 0

  point.forEach((p, index) => {
    const delta = Math.sqrt(Math.pow(p.x - ex, 2) + Math.pow(p.y - ey, 2))
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
}

function getNewRect (oPoint, scale, oTransformedRect, baseIndex) {
  var scaledRect = getScaledRect({
    x: oPoint.x,
    y: oPoint.y,
    width: oPoint.width,
    height: oPoint.height,
    scale: scale
  })
  var transformedRotateRect = transformFunction(scaledRect, oPoint.rotate)
  // 计算到平移后的新坐标
  var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left
  var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top

  // 计算平移后元素左上角的坐标
  var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2
  var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2

  // 缩放后元素的高宽
  var newWidth = scaledRect.width
  var newHeight = scaledRect.height

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight
  }
}

function getScaledRect (params, baseIndex) {
  const { x, y, width, height, scale } = params
  const offset = {
    x: 0,
    y: 0
  }
  const deltaXScale = scale.x - 1
  const deltaYScale = scale.y - 1
  const deltaWidth = width * deltaXScale
  const deltaHeight = height * deltaYScale
  const newWidth = width + deltaWidth
  const newHeight = height + deltaHeight
  const newX = x - deltaWidth / 2
  const newY = y - deltaHeight / 2
  if (baseIndex) {
    const points = [{x, y}, {x: x + width, y}, {x: x + width, y: y + height}, {x, y: y + height}]
    const newPoints = [{x: newX, y: newY}, {x: newX + newWidth, y: newY}, {x: newX + newWidth, y: newY + newHeight}, {x: newX, y: newY + newHeight}]
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

function transformFunction (options, angle) {
  let x = options.x
  let y = options.y
  let width = options.width
  let height = options.height
  let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2
  let a = Math.round(Math.atan(height / width) * 180 / Math.PI)
  let tlbra = 180 - angle - a
  let trbla = a - angle
  let ta = 90 - angle
  let ra = angle
  let halfWidth = width / 2
  let halfHeight = height / 2
  let middleX = x + halfWidth
  let middleY = y + halfHeight
  let topLeft = {
    x: middleX + r * Math.cos(tlbra * Math.PI / 180),
    y: middleY - r * Math.sin(tlbra * Math.PI / 180)
  }
  let top = {
    x: middleX + halfHeight * Math.cos(ta * Math.PI / 180),
    y: middleY - halfHeight * Math.sin(ta * Math.PI / 180)
  }
  let topRight = {
    x: middleX + r * Math.cos(trbla * Math.PI / 180),
    y: middleY - r * Math.sin(trbla * Math.PI / 180)
  }
  let right = {
    x: middleX + halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY + halfWidth * Math.sin(ra * Math.PI / 180)
  }
  let bottomRight = {
    x: middleX - r * Math.cos(tlbra * Math.PI / 180),
    y: middleY + r * Math.sin(tlbra * Math.PI / 180)
  }
  let bottom = {
    x: middleX - halfHeight * Math.sin(ra * Math.PI / 180),
    y: middleY + halfHeight * Math.cos(ra * Math.PI / 180)
  }
  let bottomLeft = {
    x: middleX - r * Math.cos(trbla * Math.PI / 180),
    y: middleY + r * Math.sin(trbla * Math.PI / 180)
  }
  let left = {
    x: middleX - halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY - halfWidth * Math.sin(ra * Math.PI / 180)
  }
  let minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  let maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  let minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  let maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  return {
    point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY
  }
}

// 变形相关
function draw (id, _this) {
  const node = document.getElementById(id)
  const obj = _this.existELeList.find(item => item.id === id)
  const arr = JSON.parse(JSON.stringify(obj.locate))
  const ops = {
    left: arr.x + 'px',
    top: arr.y + 'px',
    height: arr.height + 'px',
    width: arr.width + 'px',
    transform: 'rotate(' + arr.rotate + 'deg)'
  }
  for (var index in ops) {
    node['style'][index] = ops[index]
  }
}

function editEleList (arr, id, _this) {
  return (
    _this.$store.commit('addEle', {
      id,
      locate: arr
    })
  )
}

// // 获取中心点
// function getCenter (id, _this) {
//   const locate = _this.existELeList.find(item => item.id === id).locate
//   const transformedRect = transformFunction({
//     ...locate
//   }, locate.rotate)
//   const xList = transformedRect.point.map(item => item.x)
//   const x = sum(xList) / 8
//   const yList = transformedRect.point.map(item => item.y)
//   const y = sum(yList) / 8
//   return {x, y}
// }

function down (e, id, _this) {
  // const childEle = _this.selectEle.length === 1 && _this.selectEle[0].childEle
  const obj = _this.existELeList.find(item => item.id === id)
  const arr = JSON.parse(JSON.stringify(obj.locate))
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
    const initAngle = Math.atan2(e.pageY - (point.t + height / 2), e.pageX - (point.l + width / 2)) - arr.rotate * Math.PI / 180
    // const parCenter = getCenter(id, _this)
    // const backlists = _this.existELeList.map(li => JSON.parse(JSON.stringify(li)))

    document.onmousemove = () => {
      // 旋转开始
      const e = window.event
      const angle = Math.atan2(e.pageY - (point.t + height / 2), e.pageX - (point.l + width / 2))

      arr.rotate = Math.floor((angle - initAngle) * 180 / Math.PI)
      // // 子级元素
      // if (childEle) {
      //   childEle.forEach(ele => {
      //     // const eleObj = document.getElementById(ele)
      //     const childArr = JSON.parse(JSON.stringify(_this.existELeList.find(item => item.id === ele).locate))
      //     // const center = getCenter(ele, _this)
      //     // const distence = Math.sqrt(Math.pow(parCenter.x - center.x, 2) + Math.pow(parCenter.y - center.y, 2))
      //     // console.log(arr.rotate)
      //     // const sinVal = Math.sin(arr.rotate * 0.017453293) * distence
      //     // const cosVal = Math.cos(arr.rotate * 0.017453293) * distence
      //     childArr.rotate = arr.rotate
      //     // if (arr.rotate > -90 && arr.rotate < 0) {
      //     //   childArr.x = backlists.find(li => li.id === ele).locate.x - (distence - cosVal)
      //     //   childArr.y = backlists.find(li => li.id === ele).locate.y - sinVal
      //     // }
      //     editEleList(childArr, ele, _this)
      //     draw(ele, _this)
      //   })
      // }
      editEleList(arr, id, _this)
      draw(id, _this)
    }
  } else if (e.target.nodeName.toLowerCase() === 'i') { // 缩放
    const ex = e.pageX - containerX
    const ey = e.pageY - containerY
    // 计算初始状态旋转后的rect
    const transformedRect = transformFunction({
      x: arr.x,
      y: arr.y,
      width: arr.width,
      height: arr.height
    }, arr.rotate)
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
    const oPoint = JSON.parse(JSON.stringify(arr))
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
      arr.x = newRect.x
      arr.y = newRect.y
      arr.width = newRect.width
      arr.height = newRect.height
      editEleList(arr, id, _this)
      draw(id, _this)
    }
  } else { // 移动
    const event = window.event
    const deltaX = event.pageX - containerX - arr.x
    const deltaY = event.pageY - containerY - arr.y

    document.onmousemove = (e) => {
      arr.x = e.pageX - containerX - deltaX
      arr.y = e.pageY - containerY - deltaY
      // // 子级元素
      // if (childEle) {
      //   childEle.forEach(ele => {
      //     const eleObj = document.getElementById(ele)
      //     const childArr = JSON.parse(JSON.stringify(_this.existELeList.find(item => item.id === ele).locate))
      //     childArr.x = arr.x + eleObj.offsetLeft - box.offsetLeft
      //     childArr.y = arr.y + eleObj.offsetTop - box.offsetTop
      //     editEleList(childArr, ele, _this)
      //     draw(ele, _this)
      //   })
      // }
      editEleList(arr, id, _this)
      draw(id, _this)
    }
  }
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}

function getLocated (obj) {
  let t = obj.offsetTop
  let l = obj.offsetLeft
  while (obj.offsetParent !== null) {
    obj = obj.offsetParent
    t += obj.offsetTop
    l += obj.offsetLeft
  }
  return {t, l}
}

// 数组求和
function sum (arr) {
  let s = 0
  arr.forEach(function (val, idx, arr) {
    s += val
  }, 0)
  return s
}

export {
  getPointAndOpposite,
  getNewRect,
  transformFunction,
  draw,
  editEleList,
  down,
  sum
}
