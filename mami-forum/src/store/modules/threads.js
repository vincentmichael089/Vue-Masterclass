
import {countObjectProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'
import {makeAddChildToParentMutation} from '@/store/assetHelpers'

export default {
  state: {
    items: {} // state.threads must be changed to state.items by this change
  },
  getters: {
    threadRepliesCount (state) {
      return id => countObjectProperties(state.items[id].posts) - 1
    }
  },
  actions: {
    createThread (context, {title, text, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = firebase.database().ref('threads').push().key
        const timestamp = Math.floor(Date.now() / 1000)
        const userId = context.state.authId

        const postId = firebase.database().ref('posts').push().key

        const thread = {
          firstPostId: postId,
          title,
          forumId,
          userId,
          publishedAt: timestamp,
          posts: {}
        }

        thread.posts[postId] = postId

        const post = {
          text,
          publishedAt: timestamp,
          userId,
          threadId
        }

        const updates = {}
        // thread
        updates[`threads/${threadId}`] = thread
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        updates[`users/${userId}/threads/${threadId}`] = threadId

        updates[`posts/${postId}`] = post
        updates[`users/${post.userId}/posts/${postId}`] = postId

        firebase.database().ref().update(updates)
        .then(() => {
          // update thread
          context.commit('setItem', {resource: 'threads', item: thread, id: threadId})
          context.commit('addThreadToForum', {childId: threadId, parentId: forumId})
          context.commit('addThreadToUser', {childId: threadId, parentId: userId})

          // update post
          context.commit('setItem', {resource: 'posts', item: post, id: postId})
          context.commit('addPostToThread', {parentId: post.threadId, childId: postId})
          context.commit('addPostToUser', {childId: postId, parentId: post.userId})

          resolve(context.state.items[threadId])
        })
      })
    },

    updateThread (context, {id, title, text}) {
      return new Promise((resolve, reject) => {
        const thread = context.state.items[id]
        // const post = context.state.posts[thread.firstPostId]

        const post = context.state.posts[thread.firstPostId]

        const newThread = {...thread, title}
        // const newPost = {...post, text}

        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: context.state.authId
        }

        const updates = {}
        updates[`posts/${thread.firstPostId}/text`] = text
        updates[`posts/${thread.firstPostId}/edited`] = edited
        updates[`threads/${id}/title`] = title

        firebase.database().ref().update(updates)
        .then(() => {
          context.commit('setThread', {thread: newThread, threadId: id})
          context.commit('setPost', {post: {...post, text, edited}, postId: thread.firstPostId})
          resolve(post)
        })
      })
    },

    fetchThread (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'threads', id})
    },

    fetchThreads (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'threads', ids})
    }
  },
  mutations: {
    setThread (state, {thread, threadId}) {
      Vue.set(state.items, threadId, thread)
    },

    addPostToThread: makeAddChildToParentMutation({parent: 'threads', child: 'posts'}),

    addContributorToThread: makeAddChildToParentMutation({parent: 'threads', child: 'contributors'})
  }
}
