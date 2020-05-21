<template>
    <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <!--
          @img
            @binding {string} src src of the img
        -->
        <img class="avatar-large" v-bind:src="user.avatar" alt="">
      </a>
      <p class="desktop-only text-small">{{userPostsCount}} posts</p>
    </div>
    <div class="post-content">
      <div>
        {{post.text}}
      </div>
    </div>
    <div class="post-date text-faded">
      {{post.publishedAt}}
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  name: 'PostListItem',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    user () {
      return sourceData.users[this.post.userId]
    },
    userPostsCount () {
      return Object.keys(this.user.posts).length
    }
  }
}
</script>

<style>

</style>