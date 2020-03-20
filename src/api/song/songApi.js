import http from '@/api/http.js'
const lyric = '/lyric'
const check = '/check/music'
const songMenu = '/top/playlist'
const songOfMenu = '/playlist/detail'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */

  getSongLyric(id) {
    return http.get(lyric, {
      id
    })
  },
  getSongCheck(id) {
    return http.get(check, {
      id
    })
  },

  getSongMenu(cat, limit) {
    return http.get(songMenu, {
      cat,
      limit
    })
  },
  getSongOfMenu(id) {
    return http.get(songOfMenu, {
      id
    })
  }
}
