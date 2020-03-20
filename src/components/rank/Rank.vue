<template>
  <div
    class="rank"
    ref="rank"
  >
    <scroll
      class="rank-content"
      ref="scroll"
      :data="rank"
    >
      <div>
        <div class="officialRank">
          <h1 class="official-title">官方榜</h1>
          <ul class="official-content">
            <li
              @click="selectItem(item)"
              class="official-list"
              v-for="item in officialRank"
              :key="item.id"
            >
              <img
                class="list-img"
                :src="item.coverImgUrl"
                alt=""
              >
              <ul class="list-info">
                <li
                  class="top-list"
                  v-for="(info,index) in item.tracks"
                  :key="index"
                >
                  <span class="top"> {{index+1}}</span>
                  <span class="info">{{`${info.first}-${info.second}`}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="recommendRank">
          <h1 class="recommend-title">推荐榜</h1>
          <ul class="content">
            <li
              @click="selectItem(item)"
              class="list"
              v-for="item in recommendRank"
              :key="item.id"
            >
              <img
                class="list-img"
                :src="item.coverImgUrl"
                alt=""
              >
              <p class="list-info">{{item.name}}</p>
            </li>
          </ul>
        </div>
        <div class="moreRank">
          <h1 class="more-title">更多榜单</h1>
          <ul class="content">
            <li
              @click="selectItem(item)"
              class="list"
              v-for="item in moreRank "
              :key="item.id"
            >
              <img
                class="list-img"
                :src="item.coverImgUrl"
                alt=""
              >
              <p class="list-info">{{item.name}}</p>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import rankApi from 'api/rank/rankApi.js'
import Scroll from 'components/scroll/Scroll'
import { playlistMixin } from 'assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      rank: [],
      officialRank: [],
      recommendRank: [],
      moreRank: []
    }
  },
  created() {
    this.getRank()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({ path: `/rank/${item.id}` })
      this.setRankList(item)
    },
    getRank() {
      rankApi.getRank().then(res => {
        this.rank = res.list
        this.officialRank = this.rank.slice(0, 4)
        this.recommendRank = this.rank.slice(4, 10)
        this.moreRank = this.rank.slice(10)
      })
    },
    ...mapMutations({ setRankList: 'SET_RANK_LIST' })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
.rank {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
}
.rank-content {
  height: 100%;
  overflow: hidden;
}
.officialRank {
  .official-title {
    position: relative;
    padding-top: 10px;
    font-size: 20px;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #48d1cd2f;
    &:after {
      content: ' ';
      position: absolute;
      left: -10px;
      top: 30%;
      width: 2px;
      height: 21px;
      background-color: #48d1cc;
    }
  }
  .official-content {
    .official-list {
      display: flex;
      margin: 10px;
      .list-img {
        width: 112.5px;
        border-radius: 5%;
        height: 112.5px;
      }
      .list-info {
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .top-list {
          display: flex;

          font-size: 18px;
          .top {
            padding-right: 5px;
          }
          .info {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
.recommendRank {
  .recommend-title {
    position: relative;
    padding-top: 30px;
    font-size: 20px;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #48d1cd2f;
    &:after {
      content: ' ';
      position: absolute;
      left: -10px;
      top: 51%;
      width: 2px;
      height: 21px;
      background-color: #48d1cc;
    }
  }
}
.moreRank {
  .more-title {
    position: relative;
    padding-top: 30px;
    font-size: 20px;
    margin: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #48d1cd2f;
    &:after {
      content: ' ';
      position: absolute;
      left: -10px;
      top: 51%;
      width: 2px;
      height: 21px;
      background-color: #48d1cc;
    }
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .list {
    padding-top: 8px;
    flex-basis: 33.3%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .list-img {
      width: 30vw;
      border-radius: 5%;
      align-self: center;
    }
    .list-info {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      padding: 5px;
    }
  }
}
</style>
