import Vue from 'vue'
import Router from 'vue-router'
import PageHome from '@/views/PageHome'
import PageForum from '@/views/PageForum'
import PageThreadShow from '@/views/PageThreadShow'
import PageNotFound from '@/views/PageNotFound'
import PageCategory from '@/views/PageCategory'
import PageProfile from '@/views/PageProfile'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    },
    {
      path: '/thread/:id',
      name: 'PageThreadShow',
      component: PageThreadShow,
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
      props: true
    },
    {
      path: '/profile/edit',
      name: 'PageProfileEdit',
      component: PageProfile,
      props: {edit: true}
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
