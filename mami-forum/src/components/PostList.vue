<template>
    <div class="post-list">    
    <!--
      @PostListItem
        @binding {Object} post post object to show
        @binding {string} key key for v-for
    -->
    <PostListItem
      v-for="post in posts"
      v-bind:post="post"
      v-bind:key="post['.key']"
    />
  </div>
</template>

<script>
import PostListItem from '@/components/PostListItem'

export default {
  components: {
    PostListItem
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>