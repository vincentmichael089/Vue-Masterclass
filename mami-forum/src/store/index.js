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
      const postId = 'post' + Date.now() + Math.random()
      const timestamp = Math.floor(Date.now() / 1000)

      post['.key'] = postId
      post.userId = context.state.authId
      post.publishedAt = timestamp

      context.commit('setPost', {post, postId})
      context.commit('addPostToThread', {threadId: post.threadId, postId})
      context.commit('addPostToUser', {postId, userId: post.userId})
      return Promise.resolve(context.state.posts[postId])
    },

    updatePost (context, {id, newText}) {
      return new Promise((resolve, reject) => {
        const post = context.state.posts[id]
        context.commit('setPost', {post: {...post, text: newText}, postId: id})
        resolve(post)
      })
    },

    updateUser (context, userData) {
      context.commit('setUser', {userId: userData['.key'], userData})
    },

    createThread (context, {title, text, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = 'thread' + Date.now() + Math.random()
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

        // wait for the createPost  to be done and then get the firstPostId
        // (if not using promise it will not aware of the firstPostId resulting
        // in crash when you create new post and proceed to edit the post)
        context.dispatch('createPost', {text, threadId})
          .then(post => {
            context.commit('setThread', {threadId, thread: {...thread, firstPostId: post['.key']}})
          })

        resolve(context.state.threads[threadId])
      })
    },

    updateThread (context, {id, title, text}) {
      return new Promise((resolve, reject) => {
        const thread = context.state.threads[id]
        const post = context.state.posts[thread.firstPostId]

        const newThread = {...thread, title}
        const newPost = {...post, text}

        context.commit('setThread', {thread: newThread, threadId: id})
        context.commit('setPost', {post: newPost, postId: thread.firstPostId})

        resolve(newThread)
      })
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
