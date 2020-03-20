<template>
  <transition name="list-fade">

    <div
      class="playlist"
      @click="hide"
      v-show="showFlag"
    >
      <div
        class="playlist-container"
        @click.stop
      >
        <div class="playlist-header">
          <div class="count">{{`播放列表  共${this.playlist.length}首`}}</div>
          <div
            class="icon"
            @click="confirm"
          >
            <van-icon
              class-prefix="music-icon"
              name="clear"
              size="22px"
            />
          </div>
        </div>
        <scroll
          class="playlist-content"
          :data="sequenceList"
          ref="listContent"
        >

          <ul
            class="playlist-content-u"
            ref="list"
          >
            <li
              @click="selectItem(item,index)"
              class="playlist-content-u-l"
              v-for="(item,index) in sequenceList"
              :key="index"
            >

              <div class="l-info">
                <span
                  class="l-name"
                  :style='getCurrentIcon(item)'
                >{{item.name}}</span>
                <span class="l-disc">{{`-${getDesc(item)}`}}</span>
              </div>
              <div
                class="l-del"
                @click.stop="delSong(item)"
              >
                <van-icon
                  class-prefix="music-icon"
                  name="delete"
                  size="22px"
                />
              </div>
            </li>
          </ul>
        </scroll>
        <div
          class="close"
          @click="hide"
        ><span>关闭</span></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'components/scroll/Scroll.vue'

export default {
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'playlist'])
  },
  methods: {
    confirm() {
      this.$dialog
        .confirm({ message: '是否清空播放列表' })
        .then(() => {
          this.deleteSongList()
        })
        .catch(() => {})
    },
    delSong(item) {
      this.deleteSong(item)
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(
        this.$refs.list.children[index],
        300
      )
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return { color: '#48d1cc' }
      }
      return ''
    },
    selectItem(item, index) {
      index = this.playlist.findIndex(song => {
        return song.id === item.id
      })
      this.setCurrentIndex(index)
      this.setPlayingState(true)
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
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions(['deleteSong', 'deleteSongList'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .playlist-container {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .playlist-container {
      transform: translate3d(0, 100%, 0);
    }
  }
  .playlist-container {
    border-radius: 20px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #333;
    .playlist-header {
      position: relative;
      padding: 20px 10px 10px 20px;
      .count {
        display: inline-block;
        text-align: left;
        line-height: 100%;
        font-size: 20px;
        color: #ccc;
        width: 50%;
      }
      .icon {
        display: inline-block;
        text-align: right;
        color: #ccc;
        width: 50%;
      }
    }
    .playlist-content {
      max-height: 360px;
      overflow: hidden;

      .playlist-content-u-l {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .l-info {
          display: flex;
          height: 40px;
          align-items: center;
          padding: 0 30px 0 30px;
          overflow: hidden;

          .l-name {
            color: #ccc;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .l-disc {
            color: #666;
            font-size: 14px;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        .l-del {
          align-self: center;
          padding-right: 10px;
          color: #48d1cc;
        }
      }
    }
  }
  .close {
    text-align: center;
    font-size: 20px;
    background-color: #111;
    line-height: 50px;
    color: #fff;
  }
}
</style>
