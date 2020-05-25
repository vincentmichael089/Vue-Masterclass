<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view v-show="showPage" v-on:ready="toggleShowPage"/>
      <AppSpinner v-show="!showPage"/>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'

export default {
  name: 'app',
  components: {
    TheNavbar,
    AppSpinner
  },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    toggleShowPage () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    // start when reloaded
    NProgress.start()

    this.$router.beforeEach((to, from, next) => {
      this.showPage = false

      // start when visiting page
      NProgress.start()

      next()
    })
  }
}
</script>

<style>
@import 'assets/css/style.css';
@import '~nprogress/nprogress.css';

#nprogress .bar {
  background: #57AD8D;
}
</style>
