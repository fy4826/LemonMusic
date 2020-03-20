<template>
  <div
    class="singer"
    ref="singer"
  >
    <scroll
      ref="scroll"
      class="singer-container"
    >
      <div>
        <ul class="singer-content">
          <li
            class="singer-list"
            v-for="(item,index) in singerList"
            :key="index"
            @click="goSingerDetail(item)"
          >
            <div class="singer-index">{{index+1}}</div>
            <img
              class="singer-img"
              v-lazy="item.picUrl"
              alt=""
            >
            <p class="singer-name">{{item.alias.length>0?(item.name+'('+item.alias+')'):item.name}}</p>
          </li>
        </ul>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import singerApi from '@/api/singer/singerApi.js'
import Scroll from 'components/scroll/Scroll.vue'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'assets/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this.getSingerList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    getSingerList() {
      singerApi.getSingerList(100, 0).then(res => {
        this.singerList = res.artists
      })
    },
    goSingerDetail(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
  z-index: 1;
}
.singer-container {
  height: 100%;
  overflow: hidden;
}
.singer-content {
  padding-top: 20px;
}
.singer-list {
  display: flex;
  border-bottom: 1px solid #48d1cc;
  padding: 5px 5px 5px 10px;
  .singer-index {
    height: 50px;
    width: 25px;
    line-height: 50px;
    text-align: center;
    align-self: center;
    padding: 10px;
    font-size: 25px;
    color: darkblue;
    font-weight: bold;
    font-style: italic;
    margin-right: 10px;
  }
  .singer-img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    padding: 5px;
  }
  .singer-name {
    height: 30px;
    line-height: 30px;
    text-align: left;
    align-self: center;
    padding: 10px;
    font-size: 18px;
  }
}
</style>
