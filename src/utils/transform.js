const transform = function (options, angle) {
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

export default transform
