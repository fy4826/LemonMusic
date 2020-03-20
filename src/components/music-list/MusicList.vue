<template>
  <div class="music-list">

    <!-- back -->
    <div
      class="back"
      @click="back"
    >
      <van-icon
        class-prefix="music-icon"
        name="back"
        size="30px"
      />
    </div>
    <!-- back -->

    <!-- background -->
    <h1
      class="title"
      v-html="title"
    ></h1>

    <div
      class="bg-img"
      :style="bgStyle"
      ref="bgImage"
    >
      <div
        class="filter"
        ref="filter"
      ></div>
    </div>

    <!-- background -->
    <div
      class="bg-layer"
      ref="layer"
    ></div>
    <scroll
      @scroll="scroll"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      :data="songs"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list
          @select="selectItem"
          :songs="songs"
          :rank="rank"
        ></song-list>
      </div>

      <!-- <van-loading
        type="spinner"
        class="loading-container"
      /> -->
    </scroll>
    <!-- list -->
  </div>

</template>

<script>
import Scroll from 'components/scroll/Scroll.vue'
import SongList from 'components/song-list/SongList.vue'
import { mapActions } from 'vuex'
import { playlistMixin } from 'assets/js/mixin'
const RESERVED_HEIGHT = 45

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    ...mapActions(['selectPlay'])
  },
  watch: {
    scrollY(newY) {
      const translateY = Math.max(this.minTransalteY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newY / this.imageHeight)
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTransalteY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
        zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
    }
  },
  components: {
    Scroll,
    SongList
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(6, 148, 153);
  .back {
    width: 40px;
    height: 40px;
    text-align: center;
    position: absolute;
    line-height: 40px;
    top: 5px;
    left: 5px;
    color: #ccc;
    z-index: 40;
  }
  .title {
    position: absolute;
    top: 5px;
    left: 10%;
    z-index: 50;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    color: #eee;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .bg-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: rgb(6, 148, 153);
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  // .loading-container {
  //   width: 100%;
  //   text-align: center;
  //   position: absolute;
  // }
}
</style>
