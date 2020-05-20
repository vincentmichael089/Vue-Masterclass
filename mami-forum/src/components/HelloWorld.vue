<template>
  <div>
    <!--
      @div
        @binding {string} key key of the thread
    -->
    <div
      v-for="thread in threads"
      v-bind:key="thread.id"
      class="col-large push-top"
    >
      <h1>{{ thread.title }}</h1>
      <div class="post-list">
        <!--
          @div
            @binding {string} key key of the post
        -->
        <div v-for="postId in thread.posts" v-bind:key="postId" class="post">
          <div class="user-info">
            <a href="#" class="user-name">{{
              users[posts[postId].userId].name
            }}</a>
            <a href="#">
              <!--
                @img
                  @binding {string} src src of the image
              -->
              <img
                class="avatar-large"
                v-bind:src="users[posts[postId].userId].avatar"
                alt
              />
            </a>
            <p class="desktop-only text-small">107 posts</p>
          </div>
          <div class="post-content">
            <div>{{ posts[postId].text }}</div>
          </div>
          <div class="post-date text-faded">
            {{ posts[postId].publishedAt }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  name: 'HelloWorld',
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
