import Vue from 'vue'

export default{
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  addPostToUser: makeAddChildToParentMutation({parent: 'users', child: 'posts'}),

  addThreadToUser: makeAddChildToParentMutation({parent: 'users', child: 'threads'}),

  setUser (state, {userId, userData}) {
    Vue.set(state.users, userId, userData)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  }
}
