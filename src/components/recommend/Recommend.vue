<template>
  <div
    class="recommend"
    ref="recommend"
  >
    <scroll
      ref="scroll"
      class="recommend-container"
      :data="swipe"
    >
      <div>
        <!-- swipe -->
        <div class="dis-header">
          <van-swipe
            class="my-swipe"
            :autoplay="3000"
            indicator-color="#48d1cc"
          >
            <van-swipe-item
              v-for="item in swipe"
              :key="item.targetID"
            >
              <van-image
                :src="item.pic"
                width="100%"
                height="22vh"
                @load="imgLoad"
              >
              </van-image>
            </van-swipe-item>
          </van-swipe>
        </div>
        <!-- swipe -->

        <!-- recommend-list -->
        <div class="recommendlist">
          <div class="recommendlist-header">
            <h3 class="recommendlist-title">推荐歌单</h3>
            <div
              class="more-list"
              @click="goMenu"
            >更多</div>
          </div>
          <div class="recommendlist-show">
            <ul class="recommendlist-show-u">
              <li
                @click="selectItem(item)"
                class="recommendlist-show-u-l"
                v-for="item in recommendList_s"
                :key="item.id"
              >
                <img
                  class="l-img "
                  :src="item.picUrl"
                  alt=""
                >
                <p class="l-content">{{item.name}}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- recommend-list -->

        <!-- new song new album -->
        <van-tabs
          line-height="0"
          class="changeSA"
          @click="onClick"
        >
          <van-tab
            title="新碟"
            class="SongAndAlbum"
          >
            <div class="sa-content">
              <ul class='sa-content-u'>
                <li
                  @click="selectAlbum(item)"
                  class='a-content-u-l'
                  v-for="item in newAlbum_s"
                  :key="item.id"
                >
                  <div class="newAlbum">
                    <img
                      class="a-img"
                      v-lazy="item.picUrl"
                      alt=""
                      :style="{backgroundImage:'url('+require('assets/images/coverall.png')+')',backgroundPosition:'-240px -248px'}"
                    >
                    <div class="a-content">
                      <p class="a-name">{{item.name}}</p>
                      <p class="a-singer">{{item.artist.name}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </van-tab>
          <van-tab
            title="新歌"
            class="SongAndAlbum"
          >
            <div class="sa-content">
              <ul class='sa-content-u'>
                <li
                  @click="playNewSong(song,index)"
                  class='s-content-u-l'
                  v-for="(song,index) in songs"
                  :key="index"
                >
                  <div class="newSong">
                    <p class="s-content">{{song.name}}</p>
                    <p class="s-singer">{{getDesc(song)}}</p>
                  </div>
                  <div class="s-play">
                    <van-icon
                      class-prefix="music-icon"
                      name="sstop"
                      size="22px"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </van-tab>

        </van-tabs>
        <!-- new song new album -->

      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import recommendApi from '@/api/recommend/recommendApi.js'
import singerApi from 'api/singer/singerApi.js'
import Scroll from 'components/scroll/Scroll.vue'
import { playlistMixin } from 'assets/js/mixin'
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommendList_s: [],
      swipe: [],
      newSong_s: [],
      newAlbum_s: [],
      songs: [],
      more: 3

      // value: ''
    }
  },
  beforeCreate() {},
  created() {
    this.getswipe()
    this.getRecommendListShow()
    this.getNewSongShow()
    this.getNewAlbumShow()
  },
  beforeMount() {
    // this.getSong()
  },
  mounted() {
    // this.getSong()
  },
  beforeUpdate() {},
  updated() {},
  watch: {
    newSong_s() {
      this.getSong()
    }
  },
  computed: {
    ...mapGetters(['active'])
  },
  methods: {
    onClick() {
      this.$forceUpdate()
    },
    selectAlbum(album) {
      this.$router.push({ path: `/recommend/album${album.id}` })
      this.setAlbum(album)
    },
    selectItem(item) {
      this.$router.push({ path: `/recommend/recommendDisc${item.id}` })
      this.setRecommendDisc(item)
    },
    playNewSong(item, index) {
      this.insertSong(item)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    goMenu() {
      this.$router.push({ path: '/songMenu' })
      this.setActive(this.more)
    },
    imgLoad() {
      // 图片加载完成事件，如果存在多张banner图片，通过this.checkLoad，只需要一张加载完成，撑开高度，就重新计算better-scroll高度
      if (!this.checkLoad) {
        this.checkLoad = true
        this.$refs.scroll.refresh()
      }
    },

    // 获取轮播图
    getswipe() {
      recommendApi.getBanner(1).then(res => {
        this.swipe = res.banners
      })
    },
    // 获取推荐歌单预览
    getRecommendListShow() {
      recommendApi.getRecommendList(6).then(res => {
        this.recommendList_s = res.result
      })
    },
    // 获取推荐页新歌预览
    getNewSongShow() {
      recommendApi.getNewSongShow(0).then(res => {
        for (let i = 0; i < 15; i++) {
          this.newSong_s.push(res.data[i].id)
        }
      })
    },
    getSong() {
      for (let i = 0; i < this.newSong_s.length; i++) {
        singerApi.getDetail(this.newSong_s[i]).then(res => {
          this.songs[i] = res.songs[0]
          this.songs[i].dut = res.songs[0].dt / 1000
        })
        singerApi.getUrl(this.newSong_s[i]).then(res => {
          this.songs[i].url = res.data[0].url
        })
      }
    },
    getDesc(song) {
      const arr = []
      var str = ''
      song.ar.forEach(item => {
        arr.push(item.name)
        str = arr.join('/')
      })
      return str
    },

    // 获取推荐页新碟预览
    getNewAlbumShow() {
      recommendApi.getNewAlbumShow(10, 0).then(res => {
        this.newAlbum_s = res.albums
      })
    },
    ...mapActions(['insertSong']),
    ...mapMutations({
      setRecommendDisc: 'SET_RECOMMEND_DISC',
      setAlbum: 'SET_ALBUM',
      setActive: 'SET_ACTIVE'
    })
  },

  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}
.recommend {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
}
.recommend-container {
  height: 100%;
  overflow: hidden;
}
.recommendlist {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  .recommendlist-header {
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 50px;

    .recommendlist-title {
      // border-left: 3px solid #48d1cc;
      position: relative;
      font-size: 20px;
      font-weight: bold;
      padding: 0 15px;
      &::after {
        content: ' ';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -9px;
        width: 2px;
        height: 16px;
        background-color: #48d1cc;
      }
    }
    .more-list {
      align-self: center;
      line-height: 20px;
      text-align: center;
      border-radius: 17%;
      background-color: #eee;
      margin-right: 18px;
      padding: 0 15px;
    }
  }

  .recommendlist-show {
    .recommendlist-show-u {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-left: 2vw;
      .recommendlist-show-u-l {
        padding-top: 8px;
        flex-basis: 33.3%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .l-img {
          width: 30vw;
          border-radius: 5%;
        }
        .l-content {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: 6px 2px 0 6px;
          min-height: 30px;
          line-height: 1.2;
          font-size: 13px;
        }
      }
    }
  }
}
.changeSA {
  width: 100px;
  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 22px;
    margin-top: -9px;
    width: 2px;
    height: 20px;
    background-color: #48d1cc;
  }
  .SongAndAlbum {
    width: 100%;
    position: relative;
    .sa-content {
      width: 100vw;
      .sa-content-u {
        display: flex;
        flex-basis: 100%;
        flex-direction: column;
        .a-content-u-l {
          .newAlbum {
            display: flex;
            margin: 5px 0px 5px 5px;
            background-color: #5ae6eb7c;
            .a-img {
              align-self: center;
              width: 60px;
              height: 60px;
              margin-left: 5px;
              padding-right: 15px;
              background: no-repeat;
            }
            .a-content {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: #444;
              padding-left: 10px;
              .a-name {
                padding: 6px 2px 0 6px;
                // min-height: 30px;
                // line-height: 30px;
                // text-overflow: ellipsis;
                font-size: 13px;
                font-weight: bold;
                width: 60vw;
              }
              .a-singer {
                padding: 6px 2px 0 6px;
                min-height: 30px;
                line-height: 30px;
                font-size: 12px;
                color: #333;
              }
            }
          }
        }

        .s-content-u-l {
          &:hover {
            border-bottom: 2px solid #5ae6eb7c;
          }
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          border-left: 2px solid #5ae6eb7c;
          .newSong {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 5px 0px 5px 5px;
            .s-content {
              padding: 6px 2px 0 6px;
              min-height: 20px;
              line-height: 20px;
              font-size: 13px;
            }
            .s-singer {
              padding: 6px 2px 0 6px;
              min-height: 25px;
              line-height: 25px;
              font-size: 13px;
            }
          }
          .s-play {
            padding-right: 10px;
            align-self: center;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.van-tabs__line {
  z-index: 0;
}
</style>
