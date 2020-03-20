import http from '@/api/http.js'
const banner = '/banner'
const recommendList = '/personalized'
const newSong = '/top/song'
const newAlbum = '/top/album'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */

  getBanner(type) {
    return http.get(banner, {
      type
    })
  },
  /**
   * @description: 推荐歌单
   * @param pageSize 取出数量, 默认为 30
   * @param page 偏移数量, 用于分页, 如:( 页数 -1)*30, 其中30为limit的值, 默认为0
   * @return:
   */

  getRecommendList(limit) {
    return http.get(recommendList, {
      limit
    })
  },
  /**
   * @description: 推荐歌单
   * @param pageSize 取出数量, 默认为 30
   * @param page 偏移数量, 用于分页, 如:( 页数 -1)*30, 其中30为limit的值, 默认为0
   * @return:
   */

  getNewAlbumShow(limit, offset) {
    return http.get(newAlbum, {
      limit,
      offset
    })
  },
  /**
   * @description: 推荐歌单
   * @param pageSize 取出数量, 默认为 30
   * @param page 偏移数量, 用于分页, 如:( 页数 -1)*30, 其中30为limit的值, 默认为0
   * @return:
   */

  getNewSongShow(type) {
    return http.get(newSong, {
      type
    })
  }
}
