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
import songApi from 'api/song/songApi'
import singerApi from 'api/singer/singerApi'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.recommendDisc.name
    },
    bgImage() {
      return this.recommendDisc.picUrl
    },
    ...mapGetters(['recommendDisc'])
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
      songApi.getSongOfMenu(this.recommendDisc.id).then(res => {
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
</style>
