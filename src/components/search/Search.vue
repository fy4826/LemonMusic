<template>
  <div class="search">
    <div class="search-content">
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
      <div class="search-box">
        <form action="/">
          <van-search
            v-model="value"
            placeholder="请输入歌曲、歌手"
            @search="onSearch"
            shape="round"
            background="#48d1cc"
          />
        </form>
      </div>
    </div>
    <div
      class="hot-search"
      v-if="!value"
    >
      <h1 class="hot-search-title">热门搜索</h1>
      <div class="hot-tags">
        <van-tag
          class="tag"
          @click="setVal(item.first)"
          v-for="(item,index) in hotSearchList"
          :key='index'
          round
          color='#fff'
          text-color='#01504d'
        >{{item.first}}</van-tag>
      </div>
    </div>
    <div
      class="search-result"
      v-show="value"
      ref="SearchResult"
    >
      <suggest
        :query='value'
        ref="suggest"
      ></suggest>
    </div>
  </div>
</template>

<script>
import searchApi from 'api/search/searchApi.js'
import Suggest from 'components/suggest/Suggest.vue'
export default {
  data() {
    return {
      value: '',
      hotSearchList: []
    }
  },
  created() {
    this.getHotSearch()
  },
  methods: {
    onSearch(val) {
      this.value = val
    },
    back() {
      this.$router.back()
    },
    setVal(val) {
      this.value = val
    },
    getHotSearch() {
      searchApi.getHotSearch().then(res => {
        this.hotSearchList = res.result.hots
      })
    }
  },
  components: {
    Suggest
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #48d1cc;
  .search-content {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .back {
      color: #fff;
      margin: 5px;
    }
    .search-box {
      flex: 1;
    }
  }
  .hot-search {
    // width: 100%;
    /// margin: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .hot-search-title {
      padding-left: 5px;
      margin: 10px;
      color: #01504d;
    }
    .hot-tags {
      align-self: center;
      padding: 5px;
      .tag {
        padding: 5px 10px;
        margin: 0 20px 10px 0;
      }
    }
  }
}
</style>
