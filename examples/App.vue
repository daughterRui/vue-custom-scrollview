<template>
  <div id="app">
    <main class="position-box">
      <div class="test">TopTest</div>
      <vue-scroll
        ref="scroll"
        class="scroll-home"
        :probeType="3"
        :pullUpLoad="true"
        @pullingDown="onRefresh"
        @pullingUp="onLoad"
      >
          <ul class="contantView">
            <li class="list-item" v-for="item in items" :key="item">{{item}}</li>
          </ul>
          <template v-slot:pullup="slotPullUpProps">
            <div v-if="slotPullUpProps.finishPullUp" class="loadingText">加载中...</div>
            <div v-else class="loadingText">我是有底线的...</div>
          </template>
          <!-- <template v-slot:pulldown="slotProps">
            <span>{{slotProps}}</span>
          </template> -->
      </vue-scroll>
    </main>
  </div>
</template>

<script>

let count = 1;

export default {
  name: 'demo',
  components: {
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    // 模拟数据请求
    getData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const arr = [];
          for (let i = 0; i < 10; i++) {
            arr.push(count++);
          }
          resolve(arr);
        }, 1000);
      });
    },
    onRefresh() {
      // 模拟下拉刷新
      console.log('下拉刷新', this.$refs.scroll);
      count = 0;
      this.getData().then((res) => {
        this.items = res;
        this.$refs.scroll.forceUpdate(true);
      });
    },
    onLoad() {
      // 模拟上拉 加载更多数据
      console.log('上拉加载');
      this.getData().then((res) => {
        this.items = this.items.concat(res);
        if (count < 30) {
          this.$refs.scroll.forceUpdate(true);
        } else {
          this.$refs.scroll.forceUpdate(false);
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.scroll.autoPullDownRefresh();
    });
  },
};
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  -webkit-user-select: none;
 -moz-user-select: none;
 -khtml-user-select: none;
  user-select: none;
}
*{
  margin:0;
  padding:0;
}
html,body{
  width:100%;
  height:100%;
}
ul{list-style:none}
a{text-decoration: none;}
img{vertical-align:top;border:none}
.position-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .test{
    height: 60px;
    text-align: center;
    line-height: 60px;
    background-color: red
  }
  .scroll-home{
    height: calc(100% - 60px);
    overflow: hidden;
    .contantView{
      .list-item{
        height: 100px;
        text-align: center;
        border-bottom: 1px solid #cecece;
        line-height: 100px;
      }
    }
  }
}
.loadingText{
  margin-top: 10px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
</style>
