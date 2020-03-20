<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import mHeader from 'components/header/mHeader'
import Player from 'components/player/Player'
export default {
  components: {
    mHeader,
    Player
  }
}
</script>
<style lang="scss">
</style>
