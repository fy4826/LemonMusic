import {
  playMode
} from 'assets/js/config'
const state = {
  active: 0,
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  recommendDisc: {},
  album: {},
  rankList: {}
}
export default state
