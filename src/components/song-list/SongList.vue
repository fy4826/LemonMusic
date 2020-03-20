<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song,index)"
        v-for="(song,index) in songs"
        :key="index"
        class="item"
      >
        <div
          class="rank"
          v-show="rank"
        >
          <span
            :class="getRankCls(index)"
            v-text="getRankText(index)"
          ></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    //
    getRankCls(index) {
      if (index <= 2) {
        return 'text'
      }
    },
    getRankText(index) {
      if (index <= 2) {
        return 'TOP'
      } else {
        return index + 1
      }
    },
    getDesc(song) {
      const arr = []
      var str = ''
      song.ar.forEach(item => {
        arr.push(item.name)
        str = arr.join('/')
      })
      return `${str}-${song.al.name}`
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  padding: 20px;
  color: #eee;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    .rank {
      flex: 0 0 15px;
      text-align: center;
      color: #ccc;
      font-size: 18px;
      padding-right: 10px;
      .text {
        color: red;
        font-size: 20px;
        font-style: italic;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        padding-top: 4px;
        font-size: 15px;
        line-height: 20px;
        height: 20px;
      }
      .desc {
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 20px;
        height: 20px;
        color: #ccc;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>
