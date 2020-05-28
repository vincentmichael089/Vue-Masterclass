import firebase from 'firebase'

export default {
  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    authUser (state) {
      return state.authId ? state.users[state.authId] : null
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
