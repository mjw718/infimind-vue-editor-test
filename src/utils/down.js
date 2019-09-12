const down = function (e, id) {
  const targetId = e.target.id
  const boxEle = document.getElementById(id)
  if (e.target.nodeName.toLowerCase() === 'i') {
    // 缩放
    const initWidth = boxEle.offsetWidth
    const initHeight = boxEle.offsetHeight
    const deviationWidth = e.pageX
    const deviationHeight = e.pageY

    const topDistance = boxEle.offsetTop
    const leftDistance = boxEle.offsetLeft

    document.onmousemove = (e) => {
      switch (targetId) {
        case 'zuoshang':
          if (deviationWidth - e.pageX + initWidth > 0 && deviationHeight - e.pageY + initHeight > 0) {
            boxEle.style.width = deviationWidth - e.pageX + initWidth + 'px'
            boxEle.style.height = deviationHeight - e.pageY + initHeight + 'px'
            boxEle.style.top = (e.pageY - deviationHeight + topDistance) + 'px'
            boxEle.style.left = (e.pageX - deviationWidth + leftDistance) + 'px'
          }
          break
        case 'youshang':
          if (e.pageX - deviationWidth + initWidth > 0 && deviationHeight - e.pageY + initHeight > 0) {
            boxEle.style.width = e.pageX - deviationWidth + initWidth + 'px'
            boxEle.style.height = deviationHeight - e.pageY + initHeight + 'px'
            boxEle.style.top = (e.pageY - deviationHeight + topDistance) + 'px'
          }
          break
        case 'zuoxia':
          if (deviationWidth - e.pageX + initWidth > 0 && e.pageY - deviationHeight + initHeight > 0) {
            boxEle.style.width = deviationWidth - e.pageX + initWidth + 'px'
            boxEle.style.height = e.pageY - deviationHeight + initHeight + 'px'
            boxEle.style.left = (e.pageX - deviationWidth + leftDistance) + 'px'
          }
          break
        case 'youxia':
          boxEle.style.width = e.pageX - deviationWidth + initWidth + 'px'
          boxEle.style.height = e.pageY - deviationHeight + initHeight + 'px'
          break
        case 'zuozhong':
          if (deviationWidth - e.pageX + initWidth > 0) {
            boxEle.style.width = deviationWidth - e.pageX + initWidth + 'px'
            boxEle.style.left = (e.pageX - deviationWidth + leftDistance) + 'px'
          }
          break
        case 'youzhong':
          boxEle.style.width = e.pageX - deviationWidth + initWidth + 'px'
          break
        case 'shangzhong':
          if (deviationHeight - e.pageY + initHeight > 0) {
            boxEle.style.height = deviationHeight - e.pageY + initHeight + 'px'
            boxEle.style.top = e.pageY - deviationHeight + topDistance + 'px'
          }
          break
        case 'xiazhong':
          if (e.pageY - deviationHeight + initHeight > 0) {
            boxEle.style.height = e.pageY - deviationHeight + initHeight + 'px'
          }
          break
        default:
          break
      }
    }
  } else if (targetId === 'rotate-ele') {
    // 旋转
    const initX = boxEle.getBoundingClientRect().left + boxEle.offsetWidth / 2
    const initY = boxEle.getBoundingClientRect().top + boxEle.offsetHeight / 2

    document.onmousemove = (e) => {
      const rotateX = e.pageX
      const rotateY = e.pageY
      const xiangxianX = rotateX - initX
      const xiangxianY = rotateY - initY
      let res = 0
      if (xiangxianX > 0 && xiangxianY > 0) {
        // 第四象限
        res = Math.round(Math.atan((rotateX - initX) / (rotateY - initY)) / (Math.PI / 180))
      } else if (xiangxianX > 0 && xiangxianY < 0) {
        // 第一象限
        res = Math.round(Math.atan((initY - rotateY) / (rotateX - initX)) / (Math.PI / 180)) + 90
      } else if (xiangxianX < 0 && xiangxianY < 0) {
        // 第二象限
        res = Math.round(Math.atan((initX - rotateX) / (initY - rotateY)) / (Math.PI / 180)) + 180
      } else if (xiangxianX < 0 && xiangxianY > 0) {
        // 第三象限
        res = Math.round(Math.atan((rotateY - initY) / (initX - rotateX)) / (Math.PI / 180)) + 270
      }
      boxEle.style.transform = `rotate(${-res}deg)`
    }
  } else {
    // 移动
    const initX = e.pageX - boxEle.offsetLeft
    const initY = e.pageY - boxEle.offsetTop
    document.onmousemove = (e) => {
      boxEle.style.top = (e.pageY - initY) + 'px'
      boxEle.style.left = (e.pageX - initX) + 'px'
    }
  }
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}

export default down
