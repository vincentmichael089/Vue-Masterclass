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
    <!--
      @AppDate
        @binding {string} date created date of post
    -->
    <AppDate v-bind:date="post.publishedAt"/>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import AppDate from '@/components/AppDate'

export default {
  name: 'PostListItem',
  components: {
    AppDate
  },
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