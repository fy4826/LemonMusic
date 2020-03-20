<template>
  <div
    class="player"
    v-if="playlist.length>0"
  >
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-show="fullScreen"
      >
        <div class="background">
          <img
            width="100%"
            height="100%"
            v-lazy="currentSong.al.picUrl"
            alt=""
          >
        </div>
        <div class="top">
          <div
            class="back"
            @click="back"
          >
            <van-icon
              class-prefix="music-icon"
              name="laststep"
              size="22px"
            ></van-icon>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{getDesc(currentSong)}}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div
            class="middle-l"
            ref="middleL"
          >
            <div
              class="cd-wrapper"
              ref="cdWrapper"
            >
              <img
                :class="cdCls"
                class="cd"
                v-lazy="currentSong.al.picUrl"
                alt=""
                :style="{backgroundImage:'url('+require('@/assets/images/disc.png')+')',backgroundSize: 'cover'}"
              >

            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  :class="{'current':currentLineNum==index}"
                  class="lyr-text"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class="{'active':currentShow==='cd'}"
            ></span>
            <span
              class="dot"
              :class="{'active':currentShow==='lyric'}"
            ></span>
          </div>

          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                @percentChange="onProgressBarChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.dut)}}</span>
          </div>
          <div class="operators">
            <div class="i-left">
              <van-icon
                @click="changeMode"
                class-prefix="music-icon"
                :name="iconMode"
                size="27px"
              ></van-icon>
            </div>
            <div class="i-left">
              <van-icon
                :class="disableCls"
                class-prefix="music-icon"
                name="previous"
                size="30px"
                @click="prev"
              >
              </van-icon>

            </div>
            <div class="i-center">
              <van-icon
                :class="disableCls"
                @click="togglePlaying"
                class-prefix="music-icon"
                :name="playIcon"
                size="40px"
              ></van-icon>
            </div>
            <div class="i-right">
              <van-icon
                :class="disableCls"
                class-prefix="music-icon"
                name="next"
                size="30px"
                @click="next"
              ></van-icon>
            </div>
            <div class="i-right">
              <van-icon
                class-prefix="music-icon"
                name="pick"
                size="30px"
              ></van-icon>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">

      <div
        class="mini-player"
        v-show="!fullScreen"
        @click="open"
      >
        <div class="icon">
          <img
            :class="cdCls"
            class="mini-image"
            width="50"
            height="50"
            v-lazy="currentSong.al.picUrl"
            alt=""
          >
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{getDesc(currentSong)}}</p>
        </div>
        <div class="control">

          <van-icon
            @click.stop="togglePlaying"
            class-prefix="music-icon"
            :name="playIcon"
            size="35px"
          ></van-icon>
        </div>
        <div class="control">
          <div class="mini-list">
            <van-icon
              @click.stop="showPlayList"
              class-prefix="music-icon"
              name="liebiao"
              size="32px"
            ></van-icon>
          </div>
        </div>
      </div>

    </transition>
    <playList
      ref="playlist"
      @click="showPlayList"
    ></playList>
    <audio
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>

</template>

<script>
import animations from 'create-keyframe-animation'
import { mapGetters, mapMutations } from 'vuex'
import ProgressBar from 'components/progress-bar/ProgressBar.vue'
import { shuffle } from 'assets/js/until.js'
import songApi from 'api/song/songApi.js'
import Lyric from 'lyric-parser'
import Scroll from 'components/scroll/Scroll.vue'
import PlayList from 'components/playlist/PlayList.vue'
import { playMode } from 'assets/js/config'
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentRate: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      playlistFlag: false,
      pickFlag: false
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? 'list-loop'
        : this.mode === playMode.loop
        ? 'single-loop'
        : 'random'
    },
    // picked() {
    //   return this.pickFlag ? 'red' : ''
    // },
    // isPick() {
    //   return this.pickFlag ? 'picked' : 'pick'
    // },
    playIcon() {
      return this.playing ? 'play' : 'sstop'
    },
    percent() {
      return this.currentTime / this.currentSong.dut
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    showPlayList() {
      this.$refs.playlist.show()
    },
    // changePick() {
    //   return (this.pickFlag = !this.pickFlag)
    // },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: { transform: 'translate3d(0,0,0) scale(1)' }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },

    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
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
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      // if (this.currentLyric) {
      //   this.currentLyric.togglePlaying()
      // }
    },
    next() {
      if (this.playlist.length === 1) {
        return this.$toast('播放列表中只有一首歌曲')
      }
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    prev() {
      if (this.playlist.length === 1) {
        return this.$toast('播放列表中只有一首歌曲')
      }
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    getLyric() {
      songApi
        .getSongLyric(this.currentSong.id)
        .then(res => {
          this.currentLyric = new Lyric(res.lrc.lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        const lineEL = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEL, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    resetCurrentIndex(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.dut * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },

    middleTouchStart(e) {
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      )
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transitionDuration = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style.transitionDuration = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style.transitionDuration = `${time}ms`
      this.touch.initiated = false
    },

    format(interval) {
      interval = interval | 0
      const minute = (interval / 60) | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale() {
      const miniWidth = 50
      const miniLeft = 35
      const miniBottom = 35
      const Top = 80
      const width = window.innerWidth * 0.8
      const scale = miniWidth / width
      const x = -(window.innerWidth / 2) + miniLeft
      const y = window.innerHeight - Top - width / 2 - miniBottom
      return { x, y, scale }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(oldSong, newSong) {
      if (oldSong.id === newSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.src = this.currentSong.url
        if (!this.currentSong.url) {
          this.$toast.fail('不好意思，暂无版权,无法播放音乐')
        }
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },

    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    Scroll,
    PlayList
  }
}
</script>

<style lang="scss" scoped>
* {
  touch-action: none;
}
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #034546;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      height: 80px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        text-align: center;
        width: 40px;
        height: 40px;
        line-height: 40px;
        color: #eee;
      }
      .title {
        width: 70%;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 20px;
        color: #eee;
      }
      .subtitle {
        height: 40px;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        padding-top: 4px;
        color: #eee;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            padding: 50px;
            box-sizing: border-box;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            color: #fff;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .lyr-text {
            line-height: 32px;
            color: #ccc;
            font-size: 16px;
            &.current {
              color: #fff;
              font-weight: bold;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #bbb;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: #fff;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: #ccc;
          font-size: 12px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        color: #eee;
        display: flex;
        align-items: center;
        .i-left {
          width: 30%;
          text-align: right;
        }
        .i-center {
          width: 40%;
          text-align: center;
        }
        .i-right {
          text-align: left;
          width: 30%;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 70px;
    background: #48d1cc;
    .icon {
      display: flex;
      height: 100%;
      .mini-image {
        border-radius: 50%;
        padding: 5px 10px;
        align-self: center;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      .name {
        margin-bottom: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 16px;
        color: #111;
        padding-bottom: 5px;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        font-weight: bold;
        color: #555;
      }
    }
    .control {
      flex: 0 0 35px;
      width: 35px;
      padding: 0 10px;
      .mini-list {
        font-weight: bold;
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      transform: translate3d(0, 100px, 0);
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
