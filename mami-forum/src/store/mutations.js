import Vue from 'vue'

export default{
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  addPostToUser: makeAddChildToParentMutation({parent: 'users', child: 'posts'}),

  addThreadToForum: makeAddChildToParentMutation({parent: 'forums', child: 'threads'}),

  addThreadToUser: makeAddChildToParentMutation({parent: 'users', child: 'threads'}),

  setUser (state, {userId, userData}) {
    Vue.set(state.users, userId, userData)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  setAuthId (state, id) {
    state.authId = id
  },

  setUnsubscribeAuthObserver (state, unsubscribe) {
    state.unsubscribeAuthObserver = unsubscribe
  }
}
