import Vue from 'vue'
import vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import auth from './modules/auth'
import categories from './modules/categories'
import forums from './modules/forums'
import posts from './modules/posts'
import threads from './modules/threads'
import users from './modules/users'

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
