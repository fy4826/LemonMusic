<template>
  <div class="songMenu">
    <van-tabs
      color=#48d1cc
      title-active-color=#48d1cc
      v-model="active"
    >

      <van-tab :title="tag[0].name">
        <menu-list :cat='tag[0].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[1].name">
        <menu-list :cat='tag[1].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[2].name">
        <menu-list :cat='tag[2].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[3].name">
        <menu-list :cat='tag[3].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[4].name">
        <menu-list :cat='tag[4].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[5].name">
        <menu-list :cat='tag[5].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[6].name">
        <menu-list :cat='tag[6].name'></menu-list>
      </van-tab>
      <van-tab :title="tag[7].name">
        <menu-list :cat='tag[7].name'></menu-list>
      </van-tab>
    </van-tabs>
    <router-view></router-view>
  </div>

</template>

<script>
import MenuList from './MenuList'
export default {
  data() {
    return {
      tag: [
        {
          id: 0,
          name: '全部',
          limit: 18
        },
        {
          id: 1,
          name: '官方',
          limit: 18
        },
        {
          id: 2,
          name: '华语',
          limit: 18
        },
        {
          id: 3,
          name: '欧美',
          limit: 18
        },
        {
          id: 4,
          name: '流行',
          limit: 18
        },
        {
          id: 5,
          name: '民谣',
          limit: 18
        },
        {
          id: 6,
          name: '摇滚',
          limit: 18
        },
        {
          id: 7,
          name: '电子',
          limit: 18
        }
      ],
      active: 0
    }
  },
  methods: {},
  components: {
    MenuList
  }
}
</script>

<style lang="scss" scoped >
</style>
