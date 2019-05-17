<!--
 * @Description: better-scroll插件vue化
 * @Author: xty
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-10 22:27:35
 * @LastEditTime: 2019-05-16 23:25:35
 -->

<template>
  <div ref="wrapper">
    <div class="contantView">
      <slot></slot>
      <slot v-if="pullUpDirty" name="pullup">
      </slot>
    </div>
    <slot v-if="isPullingDown" name="pulldown">
    </slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    eventPassthrough: {
      type: String,
      default: ''
    },
    click: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollbar: {
      type: [Object, Boolean],
      default: false
    },
    listenScroll: {
      type: Boolean,
      default: true
    },
    // 下拉刷新
    pullDownRefresh: {
      type: [Object, Boolean],
      default: false
    },
    // 上拉加载
    pullUpLoad: {
      type: [Object, Boolean],
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      isPullingDown: false, // 下拉状态
      isPullingUp: false, // 上拉状态
      pullUpDirty: true // 此变量用来检查是否加载到了最后一页(默认为未加载到最后一页)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      console.log(this.pullDownRefresh)
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType, // 是否实时刷新scroll
        click: this.click, // 列表中是否添加click事件
        scrollX: this.scrollX, // 是否开启横向滑动
        scrollY: this.scrollY, // 是否开启纵向滑动
        scrollbar: this.scrollbar, // 是否需要开启显示滚动条
        eventPassthrough: this.eventPassthrough, // 嵌套滑动是否互斥
        pullDownRefresh: this.pullDownRefresh, // 是否开启下拉刷新
        pullUpLoad: this.pullUpLoad // 是否开启上拉加载
      })
      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          if (this.pullUpDirty) {
            this.isPullingUp = true
            this.$emit('pullingUp')
          }
        })
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
      }
    },
    // 代理better-scroll的enable方法
    enable () {
      this.scroll && this.scroll.enable()
    },
    // 代理better-scroll的disable方法
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 代理better-scroll的destroy方法
    destroy () {
      this.scroll && this.scroll.destroy()
    },
    // 代理better-scroll的refresh方法
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    // 代理better-scroll的scrollTo方法
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 代理better-scroll的scrollToElement方法
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    forceUpdate (type, pullUpDirty) {
      this.$nextTick(() => {
        if (type === 'down') {
          this.scroll.finishPullDown()
          this.isPullingDown = false
        } else {
          if (pullUpDirty) {
            // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载，如果没有上拉后没有finishPullUp 则pullingDown销毁
            this.scroll.finishPullUp()
          } else {
            this.pullUpDirty = pullUpDirty
          }
        }
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      })
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常

  }
}
</script>

<style lang="less" scoped>
.noMore{
  position: absolute;
  left: 0;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
