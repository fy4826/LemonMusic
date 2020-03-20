import http from '@/api/http.js'
const hotSearch = '/search/hot'
const Search = '/search'
export default {
  /**
   * @description: 首页轮播图
   * @param format
   * @return:
   */
  getHotSearch() {
    return http.get(hotSearch, {

    })
  },
  getSearch(keywords, limit, offset) {
    return http.get(Search, {
      keywords,
      limit,
      offset
    })
  }

}
