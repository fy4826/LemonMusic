import http from '@/api/http.js'
const rank = '/toplist/detail'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */
  getRank() {
    return http.post(rank, {

    })
  }

}
