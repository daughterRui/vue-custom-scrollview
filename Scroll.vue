<!--
 * @Description: better-scroll插件vue化
 * @Author: xty
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-10 22:27:35
 * @LastEditTime: 2019-08-06 10:56:50
 -->

<template>
  <div ref="wrapper">
    <div class="contantView">
      <div ref="listWrapper">
        <slot>
        </slot>
        <slot v-if="pullUpDirty" name="pullup">
        </slot>
      </div>
      <div class="pulldown">
        <slot v-if="pullDownRefresh" name="pulldown" :isPullingDownStatus="isPullingDownStatus" :isPullingDown="isPullingDown">
          <Loading
            :isPullingDownStatus="isPullingDownStatus"
            :isPullingDown="isPullingDown"
            :isTouchEndStatus="isTouchEndStatus"
          ></Loading>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getRect } from '../utils/dom'
import Loading from './Loading'
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
    // 下拉刷新默认添加，不需要传false
    pullDownRefresh: {
      type: [Object, Boolean],
      default () {
        return {
          threshold: 60,
          stop: 50
        }
      }
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
  components: {
    Loading
  },
  data () {
    return {
      isPullingDown: false, // 是否执行下拉的状态
      // movingDirectionY: 0, // 下拉是否已拿到数据
      isPullingUp: false, // 上拉状态
      pullUpDirty: true, // 此变量用来检查是否加载到了最后一页(默认为未加载到最后一页)
      isPullingDownStatus: false, // 下拉刷新是否该执行的状态
      isTouchEndStatus: true
    }
  },
  watch: {

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
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType, // 是否实时刷新scroll
        click: this.click, // 列表中是否添加click事件
        scrollX: this.scrollX, // 是否开启横向滑动
        scrollY: this.scrollY, // 是否开启纵向滑动
        scrollbar: this.scrollbar, // 是否需要开启显示滚动条
        eventPassthrough: this.eventPassthrough, // 嵌套滑动是否互斥
        pullDownRefresh: this.pullDownRefresh, // 是否开启下拉刷新
        pullUpLoad: this.pullUpLoad, // 是否开启上拉加载
        useTransition: false // 是否启动css动画,false启动js动画
      })
      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          if (pos.y > 60) {
            this.isPullingDownStatus = true
          } else {
            this.isPullingDownStatus = false
          }
          this.$emit('scroll', pos)
        })
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullUpLoad) {
        const _this = this
        _this.scroll.on('pullingUp', () => {
          if (_this.pullUpDirty) {
            _this.isPullingUp = true
            _this.$emit('pullingUp')
          }
        })
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
        // 监听手指离开的事件
        this.scroll.on('touchEnd', (pos) => {
          if (pos.y > 60) {
            this.isTouchEndStatus = true
          } else {
            this.isTouchEndStatus = false
          }
        })
        // 监听手指触摸前的事件
        this.scroll.on('beforeScrollStart', () => {
          this.isTouchEndStatus = false
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
    // 代理better-scroll的autoPullDownRefresh方法
    autoPullDownRefresh () {
      this.scroll && this.scroll.autoPullDownRefresh()
    },
    // 代理better-scroll的closePullUp方法
    closePullUp () {
      this.scroll && this.scroll.closePullUp()
    },
    // 代理better-scroll的openPullUp方法
    openPullUp () {
      this.scroll && this.scroll.openPullUp()
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
    forceUpdate (dirty) {
      this.$nextTick(() => {
        this.pullUpDirty = dirty
        if (this.pullDownRefresh) {
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad) {
          this.scroll.finishPullUp()
          this.refresh()
        } else {
          this.refresh()
        }
      })
    },
    _reboundPullDown () {
      const { stopTime = 600 } = this.pullDownRefresh
      return new Promise(resolve => {
        this.reboundPullDownTimer = setTimeout(() => {
          this.isPullingDown = false
          this.scroll.finishPullUp()
          this.scroll.finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    _afterPullDown () {
      this.afterPullDownTimer = setTimeout(() => {
        this.refresh()
      }, this.scroll.options.bounceTime)
    }
  },
  destroyed () {
    this.scroll && this.scroll.destroy()
    this.reboundPullDownTimer && clearTimeout(this.reboundPullDownTimer)
    this.reboundPullDownTimer = null
    this.afterPullDownTimer && clearTimeout(this.afterPullDownTimer)
    this.afterPullDownTimer = null
  }
}
</script>

<style lang="less" scoped>
.pulldown{
  position: absolute;
  left: 0;
  top: -60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
}
</style>
