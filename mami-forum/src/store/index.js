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
      post['.key'] = postId

      context.commit('setPost', {post, postId})
      context.commit('addPostToThread', {threadId: post.threadId, postId})
      context.commit('addPostToUser', {postId, userId: post.userId})
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },

    addPostToThread (state, {postId, threadId}) {
      Vue.set(state.threads[threadId].posts, postId, postId)
    },

    addPostToUser (state, {postId, userId}) {
      Vue.set(state.users[userId].posts, postId, postId)
    }

  }

  // ,
  // methods: {
  //   addPost (event) {
  //     const post = event.post
  //     const postId = event.post['.key']
  //     // add post to list of posts
  //     // this.$store.state.posts[postId] = post // but this one is not reactive
  //     this.$set(this.$store.state.posts, postId, post) // with set it become reactive

  //     // append the post id to the thread
  //     // this.thread.posts[postId] = postId // but this one is not reactive
  //     this.$set(this.thread.posts, postId, postId) // with set it become reactive

  //     // append the post to the user
  //     this.$set(this.$store.state.users[post.userId].posts, postId, postId)
  //     console.log(this.$store.state)
  //   }
  // }
})
