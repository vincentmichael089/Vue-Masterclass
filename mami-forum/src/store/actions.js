import firebase from 'firebase'
import {removeEmptyProperties} from '@/utils'

export default {

  initAuthentication (context) {
    return new Promise((resolve, reject) => {
      if (context.state.unsubscribeAuthObserver) { // if there is observer already
        context.state.unsubscribeAuthObserver() // unsubscribe so there is no multiple observer
      }

      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.dispatch('fetchAuthUser')
          .then(dbUser => resolve(dbUser))
        } else {
          resolve(null)
        }
      })

      context.commit('setUnsubscribeAuthObserver', unsubscribe) // unsubscribe can be called to unsubscribe the observer. example = unsubscribe()
    })
  },

  createUser (context, {id, email, name, username, avatar = null}) {
    return new Promise((resolve, reject) => {
      const timestamp = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {avatar, email, name, username, usernameLower, registeredAt: timestamp}

      firebase.database().ref('users').child(id).set(user)
      .then(() => {
        context.commit('setItem', {item: user, id: id, resource: 'users'})
        resolve(context.state.users[id])
      })
    })
  },

  registerUserWithEmailAndPassword (context, {email, name, username, password, avatar = null}) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      return context.dispatch('createUser', {id: userCredential.user.uid, email, name, username, avatar})
    })
    .then(() => context.dispatch('fetchAuthUser'))
  },

  signInWithEmailAndPassword (context, {email, password}) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  signInWithGoogle (context) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
      .then(data => {
        const user = data.user
        firebase.database().ref('users').child(user.uid).once('value', snapshot => {
          if (!snapshot.exists()) { // if user isnt registered
            return context.dispatch('createUser', {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              username: user.email,
              avatar: user.photoURL
            })
            .then(() => context.dispatch('fetchAuthUser'))
          }
        })
      })
  },

  signOut (context) {
    return firebase.auth().signOut()
    .then(() => {
      context.commit('setAuthId', null)
    })
  },

  fetchAuthUser (context) {
    const userId = firebase.auth().currentUser.uid // get the current userId

    return new Promise((resolve, reject) => {
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) { // check if user exists in the database
          return context.dispatch('fetchUser', {id: userId}) // fetch the current user data
            .then(user => {
              context.commit('setAuthId', userId) // set the state authId to userId
              resolve(user)
            })
        } else {
          resolve(null)
        }
      })
    })
  },

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
      return Promise.resolve(context.state.posts[postId])
    })
  },

  updatePost (context, {id, newText}) {
    return new Promise((resolve, reject) => {
      const post = context.state.posts[id]
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

  fetchCategory (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'categories', id})
  },

  fetchCategories (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'categories', ids})
  },

  fetchPost (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'posts', id})
  },

  fetchPosts (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'posts', ids})
  },

  fetchForum (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'forums', id})
  },

  fetchForums (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'forums', ids})
  },

  fetchUser (context, {id}) {
    return context.dispatch('fetchItem', {resource: 'users', id})
  },

  fetchUsers (context, {ids}) {
    return context.dispatch('fetchItems', {resource: 'users', ids})
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
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
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
}
