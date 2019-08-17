<template>
  <div class="loading">
    <img v-if="!isTouchEndStatus && !isPullingDown" :class="[isPullingDownStatus ? imgAnimation : scrollImg]" src="https://gt-toolbox.oss-cn-beijing.aliyuncs.com/gt-toolbox/d8a3286d-ea1c-4c84-be1f-c221573f2dd9.svg">
    <div v-else>
      <LoadingCss />
    </div>
    <span v-if="!isTouchEndStatus && !isPullingDown" class="pullDownText">{{isPullingDownStatus ? '松开立即刷新': '下拉可以刷新'}}</span>
  </div>
</template>

<script>
import LoadingCss from './LoadingCss.vue';

export default {
  name: 'loading',
  props: {
    isPullingDownStatus: {
      type: Boolean,
      default: false,
    },
    isPullingDown: {
      type: Boolean,
      default: false,
    },
    isTouchEndStatus: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    LoadingCss,
  },
  watch: {
    isPullingDown: {
      handler(val) {
        // console.log('val', val)
      },
      immediate: true,
    },
  },
  data() {
    return {
      scrollImg: 'scrollImg',
      imgAnimation: 'imgAnimation',
    };
  },
};
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  height: 100%;
  align-items: center;
  .scrollImg {
    width: 20px;
    transform: rotate(0deg);
    transition: .5s
  }
  .imgAnimation{
    width: 20px;
    transform: rotate(-180deg);
    transition: .5s
  }
  .pullDownText{
    font-size: 14px;
  }
}
</style>
