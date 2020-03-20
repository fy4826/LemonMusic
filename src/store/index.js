import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)
const store = new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  plugins: [createVuexAlong({
    local: {
      list: ['active']
    }
  })]
})
export default store
