<template>
  <div
    class="info"
    ref="Info"
  >
    <scroll
      class="info-content"
      ref="scroll"
    >

      <ul class="info-u">
        <li
          @click="selectItem(item)"
          class="info-l"
          v-for="(item,index) in typeInfo"
          :key="index"
        ><img
            class="l-img"
            :src="item.coverImgUrl"
            alt=""
          >
          <p class="l-name">{{item.name}}</p>
        </li>
      </ul>

    </scroll>
  </div>
</template>

<script>
import songApi from 'api/song/songApi.js'
import Scroll from 'components/scroll/Scroll.vue'
import { playlistMixin } from 'assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  props: {
    cat: String,
    default: () => ''
  },
  data() {
    return {
      typeInfo: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    selectItem(item) {
      this.$router.push({ path: `/songMenu/${item.id}` })
      this.setDisc(item)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.Info.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    getMenuList() {
      songApi.getSongMenu(this.cat, 18).then(res => {
        this.typeInfo = res.playlists
      })
    },
    ...mapMutations({ setDisc: 'SET_DISC' })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.info-content {
  height: 100%;
  overflow: hidden;
}
.info-u {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 2vw;
  .info-l {
    padding-top: 8px;
    flex-basis: 33.3%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .l-img {
      width: 30vw;
      border-radius: 5%;
    }
    .l-name {
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
</style>
