const getLocated = function (obj) {
  let t = obj.offsetTop
  let l = obj.offsetLeft
  while (obj.offsetParent !== null) {
    obj = obj.offsetParent
    t += obj.offsetTop
    l += obj.offsetLeft
  }
  return {t, l}
}

export default getLocated
