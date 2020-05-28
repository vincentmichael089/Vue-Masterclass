import Vue from 'vue'

export default{
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  }
}
