<template>
    <div class="font-silder" id="fontSilder">
        <el-select v-model="fontFamily" placeholder="请选择字体">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <br />
        <el-input-number v-model="fontSize" :min="1" :max="100" label="描述文字"></el-input-number>
        <br />
        <el-color-picker v-model="colorVal"></el-color-picker>
      </div>
</template>

<script>
export default {
  data () {
    return {
      options: [{
        value: 'Helvetica',
        label: 'Helvetica'
      }, {
        value: 'Arial',
        label: 'Arial'
      }, {
        value: 'Lucida Family',
        label: 'Lucida Family'
      }, {
        value: 'Verdana',
        label: 'Verdana'
      }, {
        value: 'Tahoma',
        label: 'Tahoma'
      }]
    }
  },
  computed: {
    fontSize: {
      get () {
        return this.$store.state.fontSize
      },
      set (val) {
        this.$store.commit('changeFontSize', val)
      }
    },
    fontFamily: {
      get () {
        return this.$store.state.fontFamily
      },
      set (val) {
        this.$store.commit('changeFontFamily', {'value': val})
      }
    },
    colorVal: {
      get () {
        return this.$store.state.colorVal
      },
      set (val) {
        this.$store.commit('changeColor', val)
      }
    }
  }
}
</script>

<style scoped>
.font-silder {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
