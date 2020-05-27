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
      props: true
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
      props: true
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
      props: {edit: true}
    },
    {
      path: '/register',
      name: 'PageRegister',
      component: PageRegister
    },
    {
      path: '/signin',
      name: 'PageSignIn',
      component: PageSignIn
    },
    {
      path: '/signout',
      name: 'PageSignOut',
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
  if (to.matched.some(route => route.meta.requiresAuth)) { // if the routes has meta of requiresAuth
    if (store.state.authId) {
      next()
    } else {
      next({name: 'PageHome'})
    }
  } else { // if the routes doesnt require meta of requiresAuth, just navigate
    next()
  }
})

export default router
