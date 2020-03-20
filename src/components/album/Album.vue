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
import MusicList from 'components/music-list/MusicList.vue'
import { mapGetters } from 'vuex'
import albumApi from 'api/album/albumApi'
import singerApi from 'api/singer/singerApi'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.album.name
    },
    bgImage() {
      return this.album.picUrl
    },
    ...mapGetters(['album'])
  },
  created() {
    this.getAlbum()
  },
  watch: {
    songs() {
      this.getUrl()
      this.getDuration()
    }
  },
  methods: {
    getAlbum() {
      albumApi.getAlbum(this.album.id).then(res => {
        this.songs = res.songs
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
