<template>
  <div class="col-full">
    <h1>Welcome to Mami-forum!</h1>
    <!--
      @div
        @binding {Object} threads list of threads
    -->
    <ThreadList v-bind:threads="threads"/>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import ThreadList from '@/components/ThreadList.vue'

export default {
  name: 'PageHome',
  data () {
    return {
      // transform data to array
      threads: Object.values(sourceData.threads),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    ThreadList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
