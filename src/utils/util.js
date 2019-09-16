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

export {
  getPointAndOpposite,
  getNewRect,
  transformFunction
}
