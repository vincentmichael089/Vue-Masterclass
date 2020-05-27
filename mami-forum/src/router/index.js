import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import PageHome from '@/views/PageHome'
import PageForum from '@/views/PageForum'
import PageThreadShow from '@/views/PageThreadShow'
import PageThreadCreate from '@/views/PageThreadCreate'
import PageThreadEdit from '@/views/PageThreadEdit'
import PageNotFound from '@/views/PageNotFound'
import PageCategory from '@/views/PageCategory'
import PageProfile from '@/views/PageProfile'
import PageRegister from '@/views/PageRegister'
import PageSignIn from '@/views/PageSignIn'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    },
    {
      path: '/thread/create/:forumId',
      name: 'PageThreadCreate',
      component: PageThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id',
      name: 'PageThreadShow',
      component: PageThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'PageThreadEdit',
      component: PageThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum/:id',
      name: 'PageForum',
      component: PageForum,
      props: true
    },
    {
      path: '/category/:id',
      name: 'PageCategory',
      component: PageCategory,
      props: true
    },
    {
      path: '/profile',
      name: 'PageProfile',
      component: PageProfile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'PageProfileEdit',
      component: PageProfile,
      props: {edit: true},
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister,
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'PageSignIn',
      component: PageSignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/signout',
      name: 'PageSignOut',
      meta: { requiresAuth: true },
      beforeEnter (to, from, next) {
        store.dispatch('signOut') // dont use this.store because signOut is global scope
        .then(() => next({name: 'PageHome'}))
      }
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('initAuthentication')
  .then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) { // if the routes has meta of requiresAuth
      // protected route
      if (user) {
        next()
      } else {
        next({name: 'PageSignIn', query: {redirectTo: to.path}}) // redirect to sign in page when user tries to do auth required access
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) { // if the routes has meta of requiresGuest
      // protected route
      if (!user) { // proceed only if no auth user exist
        next()
      } else {
        next({name: 'PageHome'}) // navigate to home when user exist
      }
    } else { // if the routes doesnt require meta of requiresAuth, just navigate
      next()
    }
  })
})

export default router
