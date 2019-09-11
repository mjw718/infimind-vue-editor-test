<template>
    <div class="pot-container" id="pot-container">
      <i id="zuoshang" :style="{top: 0, left: 0}" />
      <i id="youshang" :style="{top: 0, right: 0}" />

      <i id="zuoxia" :style="{bottom: 0, left: 0}" />
      <i id="youxia" :style="{bottom: 0, right: 0}" />

      <i id="zuozhong" :style="{top: '50%', left: 0}" />
      <i id="youzhong" :style="{top: '50%', right: 0}" />

      <i id="shangzhong" :style="{top: 0, left: '50%'}" />
      <i id="xiazhong" :style="{bottom: 0, left: '50%'}" />
      <div id='rotate-ele' />
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.pot-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.pot-container i {
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 50%;
  opacity: 1;
}
#rotate-ele {
  position: absolute;
  bottom: -25px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #000;
}
</style>
