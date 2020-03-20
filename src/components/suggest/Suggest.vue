<template>
  <div class="suggest">
    <scroll
      ref="Scroll"
      class="suggest-content"
      :pullup="pullup"
      :data="searchList"
      @scrollToEnd="getMoreSecarch"
    >
      <div>
        <ul class="suggest-content-u">
          <li
            @click="selectSong(item)"
            class="suggest-content-u-l"
            v-for="(item,index) in searchList"
            :key="index"
          >
            <div class="l-index">
              <span class="index">{{index+1}}</span>
            </div>
            <div class="l-info">
              <span class="l-name">{{item.name}}</span>
              <span class="l-ar">{{getDesc(item)}}</span>
            </div>
          </li>
          <van-loading
            type="spinner"
            v-show="hasMore"
            vertical
            color="#fff"
          />
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import searchApi from 'api/search/searchApi.js'
import singerApi from 'api/singer/singerApi.js'
import Scroll from 'components/scroll/Scroll.vue'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      searchList: [],
      pullup: true,
      offset: 0,
      hasMore: true,
      limit: 30
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  created() {},
  methods: {
    getDesc(song) {
      const arr = []
      var str = ''
      song.artists.forEach(item => {
        arr.push(item.name)
        str = arr.join('/')
      })
      return str
    },
    getUrl() {
      this.searchList.forEach(item => {
        singerApi.getUrl(item.id).then(res => {
          item.url = res.data[0].url
        })
      })
    },
    getDuration() {
      this.searchList.forEach(item => {
        singerApi.getDetail(item.id).then(res => {
          item.dut = res.songs[0].dt / 1000
          item.al = res.songs[0].al
          item.ar = res.songs[0].ar
        })
      })
    },
    getSecarch() {
      this.hasMore = true
      this.$refs.Scroll.scrollTo(0, 0)
      searchApi.getSearch(this.query, this.limit, this.offset).then(res => {
        this.searchList = res.result.songs
        this._checkMore(this.searchList, res.result)
      })
    },
    getMoreSecarch() {
      if (!this.hasMore) {
        return
      }
      this.offset++
      searchApi.getSearch(this.query, this.limit, this.offset).then(res => {
        if (res.result.songs) {
          this.searchList = this.searchList.concat(res.result.songs)
          this._checkMore(this.searchList, res.result)
        } else {
          return (this.hasMore = false)
        }
      })
    },
    _checkMore(list, count) {
      if (
        count.songCount === 0 ||
        list.length >= count.songCount ||
        list.length >= 150
      ) {
        this.hasMore = false
      }
    },
    selectSong(item) {
      this.insertSong(item)
    },
    ...mapActions(['insertSong'])
  },
  watch: {
    query() {
      this.getSecarch()
    },
    searchList() {
      this.getUrl()
      this.getDuration()
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
  .suggest-content {
    height: 100%;
    overflow: hidden;
    .suggest-content-u {
      display: flex;
      flex-direction: column;
      .suggest-content-u-l:nth-child(odd) {
        background-color: #57f5f0;
      }
      .suggest-content-u-l {
        display: flex;
        // margin: 10px;
        line-height: 20px;
        overflow: hidden;

        padding-left: 10px;
        .l-index {
          width: 30px;
          height: 40px;
          display: flex;
          .index {
            align-self: center;
            font-style: italic;
            font-size: 18px;
          }
        }
        .l-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: 10px;
          padding: 5px;
          .l-name {
            padding-top: 4px;
            font-size: 18px;
            line-height: 20px;
            height: 20px;
            color: #111;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .l-ar {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 5px;
            font-size: 14px;
            line-height: 20px;
            height: 20px;
            color: #444;
          }
        }
      }
    }
  }
}
</style>
