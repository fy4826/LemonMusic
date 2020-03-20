import http from '@/api/http.js'
const album = '/album'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */
  getAlbum(id) {
    return http.get(album, {
      id
    })
  }

}
