<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
    ></music-list>
  </transition>

</template>

<script>
import { mapGetters } from 'vuex'
import singerApi from 'api/singer/singerApi.js'
import MusicList from 'components/music-list/MusicList.vue'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    bgImage() {
      return this.singer.picUrl
    },
    title() {
      return this.singer.name
    },

    ...mapGetters(['singer'])
  },
  created() {
    this.getSingerDetail()
  },
  watch: {
    songs() {
      this.getUrl()
      this.getDuration()
    }
  },
  methods: {
    getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({ path: '/singer' })
        return
      }
      singerApi.getSingerSong(this.singer.id).then(res => {
        this.songs = res.hotSongs
      })
    },
    getUrl() {
      this.songs.forEach(item => {
        singerApi.getUrl(item.id).then(res => {
          item.url = res.data[0].url
        })
      })
    },
    getDuration() {
      this.songs.forEach(item => {
        singerApi.getDetail(item.id).then(res => {
          item.dut = res.songs[0].dt / 1000
        })
      })
    }
  },

  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #48d1cc;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
