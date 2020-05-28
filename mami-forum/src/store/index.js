import Vue from 'vue'
import vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    categories: {},
    forums: {},
    posts: {},
    users: {}
  },
  getters,
  actions,
  mutations
})
