<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <!--
        @router-view
          @binding {string} key route.path make sure that element will be loaded when moving using the same components
          i.e page profile and page profile share the same components, thus it will break if we navigate between them
          without assigning unique keys
      -->
      <router-view v-show="showPage" v-on:ready="toggleShowPage" v-bind:key='$route.path'/>
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
