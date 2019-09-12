import getLocated from '../utils/getLocated'
const newDown = function (e, id) {
  const targetId = e.target.id
  const boxEle = document.getElementById(id)
  // let p = {
  //   x: 400,
  //   y: 300,
  //   height: 200,
  //   width: 300,
  //   rotate: 0
  // }
  if (e.target.nodeName.toLowerCase() === 'i') {
    // 缩放
    const initWidth = boxEle.getBoundingClientRect().width
    const initHeight = boxEle.getBoundingClientRect().height

    const downX = e.pageX
    const downY = e.pageY

    const {t, l} = getLocated(boxEle) // 获取元素中心点
    // 获取对角点
    const oppositeX = 2 * (l + initWidth / 2) - downX
    const oppositeY = 2 * (t + initHeight / 2) - downY

    document.onmousemove = (e) => {
      switch (targetId) {
        case 'zuoxia':
          const res = Math.atan(Math.abs(e.pageX - oppositeX) / Math.abs(e.pageY - oppositeY)) / (Math.PI / 180)
          const distance = Math.sqrt(Math.pow(e.pageX - oppositeX, 2) + Math.pow(e.pageY - oppositeY, 2))
          console.log(distance)
          const width = distance * Math.cos(res * 0.017453293)
          const height = distance * Math.sin(res * 0.017453293)
          console.log(res)
          console.log(width, height)
          break
        default:
          break
      }
    }
    // console.log(oppositeX, oppositeY)
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

export default newDown
