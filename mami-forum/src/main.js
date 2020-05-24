// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import AppDate from '@/components/AppDate'

import firebase from 'firebase'

Vue.component('AppDate', AppDate)
Vue.config.productionTip = false

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCTnPjVXA7aRuA7R-4I_-o43LUG6j1NhVw',
  authDomain: 'mami-forum.firebaseapp.com',
  databaseURL: 'https://mami-forum.firebaseio.com',
  projectId: 'mami-forum',
  storageBucket: 'mami-forum.appspot.com',
  messagingSenderId: '424506206449',
  appId: '1:424506206449:web:b59d30c1ab6b2ba1946150',
  measurementId: 'G-SHJS098331'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    store.dispatch('fetchUser', {id: store.state.authId})
  }
})
