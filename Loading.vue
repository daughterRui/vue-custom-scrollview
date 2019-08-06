<template>
  <div class="loading">
    <img v-if="!isTouchEndStatus && !isPullingDown" :class="[isPullingDownStatus ? imgAnimation : scrollImg]" :src="downImg">
    <div v-else>
      <van-loading type="spinner" size="1.5rem"/>
    </div>
    <span v-if="!isTouchEndStatus && !isPullingDown" class="pullDownText">{{isPullingDownStatus ? '松开立即刷新': '下拉可以刷新'}}</span>
  </div>
</template>

<script>
import downImg from './assets/down.svg'
import upImg from './assets/up.svg'
export default {
  name: 'loading',
  props: {
    isPullingDownStatus: {
      type: Boolean,
      default: false
    },
    isPullingDown: {
      type: Boolean,
      default: false
    },
    isTouchEndStatus: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isPullingDown: {
      handler (val) {
        // console.log('val', val)
      },
      immediate: true
    }
  },
  data () {
    return {
      downImg: downImg,
      upImg: upImg,
      scrollImg: 'scrollImg',
      imgAnimation: 'imgAnimation'
    }
  }
}
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
