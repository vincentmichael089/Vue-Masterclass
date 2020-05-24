<template>
   <div class="col-large push-top" v-if="thread && creator"> <!--v-if added so the template aware if data is fetched from firebase-->
    <h1>{{thread.title}}</h1>
     <router-link
        v-bind:to="{name: 'PageThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
     <p>
      Creadted By <a href="#" class="link-unstyled">{{creator.name}}</a>,
      <!--
        @AppDate
          @binding {string} date created date of post
      -->
      <AppDate v-bind:date="thread.publishedAt"/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{repliesCount}} replies by {{contributorsCount}} contributors</span>
    </p>
    <!--
      @PostList
        @binding {Array} posts pass posts to PostList
    -->
    <PostList v-bind:posts="posts"/>

    <h3>Reply to this Thread</h3>
    <!--
      @PostEditor
        @binding {string} threadId id of the thread
    --> 
    <PostEditor 
    v-bind:threadId="id"/>
  </div>
</template>

<script>
import firebase from 'firebase'

import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import {countObjectProperties} from '@/utils'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    PostList,
    PostEditor
  },
  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    creator () {
      return this.$store.state.users[this.$store.state.threads[this.id].userId]
    },
    posts () {
      const postIds = Object.values(this.thread.posts) // post ids that belong to the thread
      return Object.values(this.$store.state.posts).filter(post => postIds.includes(post['.key'])) // change to array and find the post that is in posts
    },
    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    },
    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    }
  },
  created () {
    this.$store.dispatch('fetchThread', {id: this.id})
      .then(thread => {
        this.$store.dispatch('fetchPosts', {ids: Object.keys(thread.posts)})
        .then(posts => {
          posts.forEach(post => {
            this.$store.dispatch('fetchUser', {id: post.userId})
          })
        })
      })
  }
}
</script>

<style>

</style>