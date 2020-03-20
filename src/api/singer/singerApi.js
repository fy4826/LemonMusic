import http from '@/api/http.js'
const singerList = '/top/artists'
const singerSong = '/artists'
const url = '/song/url'
const detail = '/song/detail'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */

  getSingerList(limit, offset) {
    return http.get(singerList, {
      limit,
      offset
    })
  },
  getSingerSong(id) {
    return http.get(singerSong, {
      id
    })
  },
  getUrl(id) {
    return http.get(url, {
      id
    })
  },
  getDetail(ids) {
    return http.get(detail, {
      ids
    })
  }
}
