import Vue from 'vue'
import vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import auth from './auth'
import categories from './categories'
import forums from './forums'
import posts from './posts'
import threads from './threads'
import users from './users'

Vue.use(vuex)

export default new vuex.Store({
  state: {},
  getters,
  actions,
  mutations,
  modules: {
    auth,
    categories,
    forums,
    posts,
    threads,
    users
  }
})
