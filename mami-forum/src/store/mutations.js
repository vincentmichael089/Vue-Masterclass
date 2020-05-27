import Vue from 'vue'

const makeAddChildToParentMutation = function ({child, parent}) {
  return (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }
}

export default{
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

  addContributorToThread: makeAddChildToParentMutation({parent: 'threads', child: 'contributors'}),

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
