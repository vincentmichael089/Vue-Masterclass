<template>
  <div class="col-full">
    <h1>Welcome to Mami-forum!</h1>
    <!--
      @ForumList
        @binding {Array} forums forums list
    -->
    <ForumList v-bind:forums="forums"/>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import ForumList from '@/components/ForumList.vue'

export default {
  name: 'PageHome',
  data () {
    return {
      // transform data to array
      forums: Object.values(sourceData.forums),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    ForumList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
