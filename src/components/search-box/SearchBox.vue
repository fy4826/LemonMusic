<template>
  <div class="search-box">
    <van-icon
      class-prefix="music-icon"
      name="search"
      size="22px"
    />
    <input
      class="box"
      :placeholder="placeholder"
    >
    <van-icon
      class-prefix="music-icon"
      name="shanchu"
      size="22px"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  z-index: 40;
  position: absolute;
  top: 8px;
  left: 13%;
  display: flex;
  align-items: center;
  background-color: #333;
  border-radius: 6px;
  box-sizing: border-box;
  height: 40px;
  padding: 0 6px;
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background-color: #333;
    color: #fff;
    font-size: 14px;
  }
}
</style>
