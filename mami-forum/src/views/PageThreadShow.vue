<template>
   <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <!--
      @PostList
        @binding {Array} posts pass posts to PostList
    -->
    <PostList v-bind:posts="posts"/>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import PostList from '@/components/PostList'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    PostList
  },
  data () {
    return {
      thread: sourceData.threads[this.id]
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts) // post ids that belong to the thread
      return Object.values(sourceData.posts).filter(post => postIds.includes(post['.key'])) // change to array and find the post that is in posts
    }
  }
}
</script>

<style>

</style>