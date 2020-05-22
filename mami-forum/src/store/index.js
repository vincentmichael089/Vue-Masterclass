import Vue from 'vue'
import vuex from 'vuex'
import sourceData from '@/data.json'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    ...sourceData,
    authId: 'jUjmgCurRRdzayqbRMO7aTG9X1G2'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },
  actions: {
    createPost (context, post) {
      const postId = Date.now() + Math.random()
      const timestamp = Math.floor(Date.now() / 1000)

      post['.key'] = postId
      post.userId = context.state.authId
      post.publishedAt = timestamp

      context.commit('setPost', {post, postId})
      context.commit('addPostToThread', {threadId: post.threadId, postId})
      context.commit('addPostToUser', {postId, userId: post.userId})
    },

    updateUser (context, userData) {
      context.commit('setUser', {userId: userData['.key'], userData})
    },

    createThread (context, {title, text, forumId}) {
      const threadId = Date.now() + Math.random()
      const timestamp = Math.floor(Date.now() / 1000)
      const userId = context.state.authId

      const thread = {
        '.key': threadId,
        title,
        forumId,
        userId,
        publishedAt: timestamp
      }

      context.commit('setThread', {thread, threadId})
      context.commit('addThreadToForum', {threadId, forumId})
      context.commit('addThreadToUser', {threadId, userId})

      context.dispatch('createPost', {text, threadId})
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },

    addPostToThread (state, {postId, threadId}) {
      const thread = state.threads[threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },

    addPostToUser (state, {postId, userId}) {
      const user = state.users[userId]
      if (!user.posts) {
        Vue.set(user, 'posts', {})
      }
      Vue.set(user.posts, postId, postId)
    },

    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },

    addThreadToForum (state, {threadId, forumId}) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },

    addThreadToUser (state, {threadId, userId}) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    },

    setUser (state, {userId, userData}) {
      Vue.set(state.users, userId, userData)
    }
  }
})
