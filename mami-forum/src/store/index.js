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
    threads: {},
    posts: {},
    users: {},
    authId: 'jUjmgCurRRdzayqbRMO7aTG9X1G2'
  },
  getters,
  actions,
  mutations
})
