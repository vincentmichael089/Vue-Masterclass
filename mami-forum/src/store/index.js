import Vue from 'vue'
import vuex from 'vuex'

import firebase from 'firebase'
import {countObjectProperties} from '@/utils'

Vue.use(vuex)

const makeAddChildToParentMutation = function ({child, parent}) {
  return (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
}

export default new vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'jUjmgCurRRdzayqbRMO7aTG9X1G2'
  },
  getters: {
    authUser (state) {
      return {}
    },

    userPostsCount (state) {
      return id => countObjectProperties(state.users[id].posts)
    },

    userThreadsCount (state) {
      return id => countObjectProperties(state.users[id].threads)
    },

    threadRepliesCount (state) {
      return id => countObjectProperties(state.threads[id].posts) - 1
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
      context.commit('addPostToThread', {parentId: post.threadId, childId: postId})
      context.commit('addPostToUser', {childId: postId, parentId: post.userId})
      return Promise.resolve(context.state.posts[postId])
    },

    updatePost (context, {id, newText}) {
      return new Promise((resolve, reject) => {
        const post = context.state.posts[id]
        context.commit('setPost', {
          post: {...post,
            text: newText,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: context.state.authId
            }
          },
          postId: id
        })
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
        context.commit('addThreadToForum', {childId: threadId, parentId: forumId})
        context.commit('addThreadToUser', {childId: threadId, parentId: userId})

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
        // const post = context.state.posts[thread.firstPostId]

        const newThread = {...thread, title}
        // const newPost = {...post, text}

        context.commit('setThread', {thread: newThread, threadId: id})
        // context.commit('setPost', {post: newPost, postId: thread.firstPostId})

        context.dispatch('updatePost', {id: thread.firstPostId, newText: text})
          .then(() => {
            resolve(newThread)
          })
      })
    },

    fetchThread (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'threads', id})
    },

    fetchPost (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'posts', id})
    },

    fetchPosts (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'posts', ids})
    },

    fetchForums (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'forums', ids})
    },

    fetchUser (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'users', id})
    },

    fetchItem (context, {id, resource}) {
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          context.commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
          resolve(context.state[resource][id])
        })
      })
    },

    fetchItems (context, {ids, resource}) {
      return Promise.all(ids.map(id => context.dispatch('fetchItem', {id, resource})))
    },

    fetchAllCategories (context) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            context.commit('setItem', {resource: 'categories', id: categoryId, item: category})
          })
          resolve(Object.values(context.state.categories))
        })
      })
    }
  },
  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },

    addPostToThread: makeAddChildToParentMutation({parent: 'threads', child: 'posts'}),

    addPostToUser: makeAddChildToParentMutation({parent: 'users', child: 'posts'}),

    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },

    addThreadToForum: makeAddChildToParentMutation({parent: 'forums', child: 'threads'}),

    addThreadToUser: makeAddChildToParentMutation({parent: 'users', child: 'threads'}),

    setUser (state, {userId, userData}) {
      Vue.set(state.users, userId, userData)
    },

    setItem (state, {item, id, resource}) {
      item['.key'] = id
      Vue.set(state[resource], id, item)
    }
  }
})
