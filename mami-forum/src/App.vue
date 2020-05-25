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
      this.showPage = !this.showPage
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      this.toggleShowPage()
      next()
    })
  }
}
</script>

<style>
@import 'assets/css/style.css';
</style>
