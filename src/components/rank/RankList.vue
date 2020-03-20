<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
      :rank="rank"
    ></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/MusicList.vue'
import { mapGetters } from 'vuex'
import songApi from 'api/song/songApi'
import singerApi from 'api/singer/singerApi'
export default {
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title() {
      return this.rankList.name
    },
    bgImage() {
      return this.rankList.coverImgUrl
    },
    ...mapGetters(['rankList'])
  },
  created() {
    this.getSongOfMenu()
  },
  watch: {
    songs() {
      this.getUrl()
      this.getDuration()
    }
  },
  methods: {
    getSongOfMenu() {
      songApi.getSongOfMenu(this.rankList.id).then(res => {
        this.songs = res.playlist.tracks
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
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
