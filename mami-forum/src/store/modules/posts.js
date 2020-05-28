import firebase from 'firebase'
import Vue from 'vue'
export default {
  state: {
    items: {}
  },
  actions: {
    createPost (context, post) {
      const postId = firebase.database().ref('posts').push().key
      const timestamp = Math.floor(Date.now() / 1000)
      post.userId = context.state.authId
      post.publishedAt = timestamp

      const updates = {}

      updates[`posts/${postId}`] = post
      updates[`threads/${post.threadId}/posts/${postId}`] = postId
      updates[`users/${post.userId}/posts/${postId}`] = postId
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId

      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'posts', item: post, id: postId})
        context.commit('addPostToThread', {parentId: post.threadId, childId: postId})
        context.commit('addPostToUser', {childId: postId, parentId: post.userId})
        context.commit('addContributorToThread', {parentId: post.threadId, childId: post.userId})
        return Promise.resolve(context.state.items[postId])
      })
    },

    updatePost (context, {id, newText}) {
      return new Promise((resolve, reject) => {
        const post = context.state.items[id]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: context.state.authId
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
      return context.dispatch('fetchItem', {resource: 'posts', id})
    },

    fetchPosts (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'posts', ids})
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.items, postId, post)
    }
  }
}
