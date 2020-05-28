import firebase from 'firebase'

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    authUser (state, getters, rootState) { // state is local state and rootState is global state
      return state.authId ? rootState.users.items[state.authId] : null // to access users we need to move global, because this module doesnt held users state
    }
  },
  actions: {
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

    registerUserWithEmailAndPassword (context, {email, name, username, password, avatar = null}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // use users/ namespace to access other modules actions. dont forget to set root to true
        return context.dispatch('users/createUser', {id: userCredential.user.uid, email, name, username, avatar}, {root: true})
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
              // use users/ namespace to access other modules actions. dont forget to set root to true
              return context.dispatch('users/createUser', {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                username: user.email,
                avatar: user.photoURL
              },
              {root: true})
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
            // use users/ namespace to access other modules actions. dont forget to set root to true
            return context.dispatch('users/fetchUser', {id: userId}, {root: true}) // fetch the current user data
              .then(user => {
                context.commit('setAuthId', userId) // set the state authId to userId
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },

    setUnsubscribeAuthObserver (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}
