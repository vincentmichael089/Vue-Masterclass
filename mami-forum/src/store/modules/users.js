import {countObjectProperties, removeEmptyProperties} from '@/utils'
import firebase from 'firebase'
import Vue from 'vue'
import {makeAddChildToParentMutation} from '@/store/assetHelpers'

export default {
  namespaced: true,

  state: {
    items: {}
  },
  getters: {
    userPostsCount (state) {
      return id => countObjectProperties(state.items[id].posts)
    },

    userThreadsCount (state) {
      return id => countObjectProperties(state.items[id].threads)
    },

    userPosts (state, getters, rootState) {
      return id => {
        const user = state.items[id]

        if (user.posts) { // if user has posts
          return Object.values(rootState.posts.items).filter(post => post.userId === id)
        }
        return []
      }
    }
  },
  actions: {
    createUser (context, {id, email, name, username, avatar = null}) {
      return new Promise((resolve, reject) => {
        const timestamp = Math.floor(Date.now() / 1000)
        const usernameLower = username.toLowerCase()
        email = email.toLowerCase()
        const user = {avatar, email, name, username, usernameLower, registeredAt: timestamp}

        firebase.database().ref('users').child(id).set(user)
        .then(() => {
          context.commit('setItem', {item: user, id: id, resource: 'users'}, {root: true})
          resolve(context.state.items[id])
        })
      })
    },

    updateUser (context, userData) {
      const updates = {
        avatar: userData.avatar,
        username: userData.username,
        name: userData.name,
        bio: userData.bio,
        website: userData.website,
        email: userData.email,
        location: userData.location
      }

      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(userData['.key']).update(removeEmptyProperties(updates))
        .then(() => {
          context.commit('setUser', {userId: userData['.key'], userData})
          resolve(userData)
        })
      })
    },

    fetchUser (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'users', id}, {root: true})
    },

    fetchUsers (context, {ids}) {
      return context.dispatch('fetchItems', {resource: 'users', ids}, {root: true})
    }
  },
  mutations: {
    addPostToUser: makeAddChildToParentMutation({parent: 'users', child: 'posts'}),

    addThreadToUser: makeAddChildToParentMutation({parent: 'users', child: 'threads'}),

    setUser (state, {userId, userData}) {
      Vue.set(state.items, userId, userData)
    }
  }
}
