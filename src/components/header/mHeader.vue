<template>
  <div class="tab-container">
    <!-- header -->
    <div class="header">
      <!-- logo -->
      <div class="logo">
        <div
          class="logo_i"
          :style="{backgroundImage:'url('+require('@/assets/images/logo1.png')+')'}"
          @click="goHome"
        >
        </div>
      </div>
      <!-- logo -->
      <!-- navbar -->
      <div class="nav">

        <van-tabs
          type="line"
          swipeable
          animated
          border
          color="#fff"
          background="#48D1CC"
          title-inactive-color=#fff
          title-active-color=#fff
          v-model="activeFlag"
          @click="onClick"
        >
          <van-tab
            style="{fontSize:30+'px'}"
            v-for="item in tab"
            :title="item.name"
            :to="item.path"
            :key="item.id"
          >
          </van-tab>
        </van-tabs>
      </div>
      <!-- navbar -->
      <!-- h-search -->
      <div
        class="search"
        @click="goSearch"
      >
        <van-icon
          class-prefix="music-icon"
          name="search"
          size="22px"
        />
      </div>
      <!-- h-search -->
    </div>
    <!-- header -->
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      tab: [
        {
          id: 0,
          name: '推荐',
          path: '/recommend'
        },
        {
          id: 1,
          name: '歌手',
          path: '/singer'
        },
        {
          id: 2,
          name: '排行榜',
          path: '/rank'
        },
        {
          id: 3,
          name: '歌单',
          path: '/songMenu'
        }
      ]
    }
  },
  computed: {
    activeFlag: {
      get() {
        return this.active
      },
      set(newval) {
        return this.setActive(newval)
      }
    },
    ...mapGetters(['active'])
  },
  methods: {
    goSearch() {
      this.$router.push({ path: '/search' })
    },
    goHome() {
      this.$router.push({ path: '/recommend' })
      this.activeFlag = 0
    },
    onClick() {
      this.setActive(this.activeFlag)
    },
    ...mapMutations({ setActive: 'SET_ACTIVE' })
  }
}
</script>

<style lang="scss" scoped>
.tab-container {
  .header {
    display: flex;
    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      background-color: #48d1cc;
      .logo_i {
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
      }
    }
    .nav {
      flex: 1;
      width: 100%;
    }
    .search {
      display: flex;
      align-items: center;
      width: 50px;
      justify-content: center;
      background-color: #48d1cc;
      color: #ddd;
    }
  }
}
</style>
<style lang="scss">
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0 0;
}
.van-tab__text {
  font-size: 18px;
}
</style>
