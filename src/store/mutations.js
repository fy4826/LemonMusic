import * as types from './mutation-types'
const mutations = {
  [types.SET_ACTIVE](state, active) {
    state.active = active
  },
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, playing) {
    state.playing = playing
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_RECOMMEND_DISC](state, recommendDisc) {
    state.recommendDisc = recommendDisc
  },
  [types.SET_ALBUM](state, album) {
    state.album = album
  },
  [types.SET_RANK_LIST](state, rankList) {
    state.rankList = rankList
  }

}
export default mutations
