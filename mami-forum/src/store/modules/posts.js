import firebase from 'firebase'
import Vue from 'vue'
export default {
  namespaced: true,

  state: {
    items: {}
  },
  actions: {
    createPost (context, post) {
      const postId = firebase.database().ref('posts').push().key
      const timestamp = Math.floor(Date.now() / 1000)
      post.userId = context.rootState.auth.authId
      post.publishedAt = timestamp

      const updates = {}

      updates[`posts/${postId}`] = post
      updates[`threads/${post.threadId}/posts/${postId}`] = postId
      updates[`users/${post.userId}/posts/${postId}`] = postId
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId

      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'posts', item: post, id: postId}, {root: true})
        context.commit('threads/addPostToThread', {parentId: post.threadId, childId: postId}, {root: true})
        context.commit('users/addPostToUser', {childId: postId, parentId: post.userId}, {root: true})
        context.commit('threads/addContributorToThread', {parentId: post.threadId, childId: post.userId}, {root: true})
        return Promise.resolve(context.state.items[postId])
      })
    },

    updatePost (context, {id, newText}) {
      return new Promise((resolve, reject) => {
        const post = context.state.items[id]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: context.rootState.auth.authId
        }

        const updates = {}
        updates.text = newText
        updates.edited = edited
        firebase.database().ref('posts').child(id).update(updates)
        .then(() => {
          context.commit('setPost', {post: {...post, text: newText, edited}, postId: id})
          resolve(post)
        })
      })
    },

    fetchPost (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'posts', id}, {root: true})
    },

    fetchPosts (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'posts', ids}, {root: true})
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.items, postId, post)
    }
  }
}
