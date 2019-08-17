<!--
 * @Description: BaseView
 * @Author: 肖天翼
 * @LastEditors: Please set LastEditors
 * @Date: 2018-12-24 16:38:22
 * @LastEditTime: 2019-05-24 14:02:38
 -->
<template>
  <div :style="{height: height + 'px'}" class="base">
      <slot name="contentView"></slot>
  </div>
</template>

<script>
export default {
  name: 'baseView',
  props: {

  },
  components: {
  },

  data() {
    return {
      height: document.documentElement.clientHeight,
    };
  },
  watch: {
    height(val) {
    // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的height值改变，就将其重新赋给data里的height
        this.height = val;
        this.timer = true;
        const that = this;
        setTimeout(() => {
          // 打印height变化的值
          console.log(that.height);
          that.timer = false;
        }, 400);
      }
    },
  },
  computed: {

  },
  methods: {

  },
  created() {

  },
  mounted() {
    window.onresize = () => {
      this.height = document.documentElement.clientHeight;
    };
  },
};
</script>
<style scoped lang="scss">
.base{
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
