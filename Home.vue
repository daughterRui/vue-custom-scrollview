<template>
  <BaseView>
      <!-- <Amap v-if="!isWeiXinBrowser" @amap_onComplete="amap_onComplete"/> -->
      <Floating isNearBorder @tap="floatingTap">
        <div class="floatingView"></div>
      </Floating>
      <Scroll
        ref="scroll"
        class="scroll-home"
        :probeType="3"
        :pullUpLoad="true"
        @pullingDown="onRefresh"
        @pullingUp="onLoad"
      >
          <div class="contantView">
            <Header :cars="userInfo.uservehiclesList"></Header>
            <span class="c-parkingText">停车场</span>
            <ParkingList :items="listData" @goToMap="goToMap" @cancelOrder="cancelOrder" @order="order"></ParkingList>
          </div>
          <template v-slot:pullup>
            <Content :name="'home'" />
          </template>
      </Scroll>
  </BaseView>
</template>

<script>
// @ is an alias to /src
import BaseView from '@/components/BaseView.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { ContentLoader } from 'vue-content-loader'
import { setTimeout } from 'timers'
import Header from './components/Header.vue'
import Loading from '@/components/Loading.vue'
import ParkingList from './components/ParkingList.vue'
import Amap from '@/components/Amap.vue'
import Floating from '@/components/Floating.vue'
import Scroll from '@/components/Scroll.vue'
import gcoord from 'gcoord'
import utils from '@/utils/util'
export default {
  name: 'home',
  components: {
    BaseView,
    Loading,
    Header,
    ParkingList,
    ContentLoader,
    Amap,
    Floating,
    Scroll
  },
  data () {
    return {
      show: false,
      listData: [],
      page: 1,
      pageNumber: 1,
      scrollbar: {
        fade: true,
        interactive: false // 1.8.0 新增 better-scroll 滚动条
      },
      pullDownRefresh: {
        threshold: 90,
        stop: 50
      },
      actions: [
        {
          name: '高德地图'
          // subname: '高德地图开始导航'
        },
        {
          name: '百度地图'
          // subname: '百度地图开始导航'
        }
      ],
      amap_lat: 0, // 纬度
      amap_lng: 0 // 经度
    }
  },
  computed: {
    // Getting Vuex State from store/modules/movie
    ...mapState({
      isListData: state => state.home.listData,
      isPage: state => state.home.page,
      isPageNumber: state => state.home.pageNumber,
      loading: state => state['@@loading'].effects['home/loadMore']
    }),

    ...mapGetters({

    })
  },
  watch: {
    isPage (val) {
      this.page = val
    },
    isPageNumber (val) {
      this.pageNumber = val
    },
    isListData (val) {
      this.listData = val
    }
  },
  methods: {
    ...mapActions('home', ['initData', 'plusPage', 'initPage']),
    // onLoad 加载数据
    onLoad () {
      this.requestData('loadMore')
    },
    requestData (type) {
      const { page, pageNumber } = this
      setTimeout(() => {
        this.$store.dispatch('home/loadMore', {
          type,
          page
        }).then(() => {
          if (page > pageNumber) {
            this.$refs.scroll.forceUpdate('up', false)
          }
          this.$refs.scroll.forceUpdate('up', true)
          this.plusPage()
          this.$refs.scroll.forceUpdate('down', true)
        })
      }, 1000)
    },
    onRefresh () {
      this.initPage().then(() => {
        this.requestData('refresh')
      })
    },
    amap_onComplete (data) {
      const { position } = data
      this.amap_lat = position.lat
      this.amap_lng = position.lng
    },
    goToMap () {
      this.show = true
    },
    scroll () {

    }
  },

  created () {
    this.onLoad()
    // this.$store.dispatch('wechat/getWechatUserInfo')
  },
  activated () {
    this.$refs.scroll.refresh()
  }
}
</script>
<style scoped lang="scss">
.scroll-home{
  height: 100%;
  overflow: hidden;
  .contantView{
    display: flex;
    flex-direction: column;
    .c-parkingText{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        margin-left: 20px;
        margin-top: 20px;
    }
    .parking-list{
      display: flex;
      flex-direction: column;
    }
  }
  .pulldown{
    position: absolute;
    left: 0;
    top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  // .contentLoader{
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }
}

</style>
<style lang="scss">
  .van-actionsheet__cancel{
    color: red !important
  }
</style>
