import Vue from 'vue'
import Router from 'vue-router'
import PageHome from '@/views/PageHome'
import PageThreadShow from '@/views/PageThreadShow'

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
    }
  ]
})
