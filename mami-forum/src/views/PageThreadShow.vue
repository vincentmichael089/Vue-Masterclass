<template>
   <div class="col-large push-top" v-if="asyncDataStatus_ready"> <!--v-if added so the template aware if data is fetched from firebase-->
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
      v-if="authUser"
      v-bind:threadId="id"/>
    <div v-else class="text-center" style="margin-bottom: 50px;">
        <!--
          @router-link
            @binding {Object} to navigating to page or redirect to path
        --> 
      <router-link v-bind:to="{name: 'PageSignIn', query: {redirectTo: $route.path}}">Sign in</router-link> or
      <router-link v-bind:to="{name: 'PageRegister', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import asyncDataStatus from '@/mixins/asyncDataStatus'
import {mapGetters} from 'vuex'
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
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({
      authUser: 'auth/authUser'
    }),
    thread () {
      return this.$store.state.threads.items[this.id]
    },
    creator () {
      return this.$store.state.users.items[this.$store.state.threads.items[this.id].userId]
    },
    posts () {
      const postIds = Object.values(this.thread.posts) // post ids that belong to the thread
      return Object.values(this.$store.state.posts.items).filter(post => postIds.includes(post['.key'])) // change to array and find the post that is in posts
    },
    repliesCount () {
      return this.$store.getters['threads/threadRepliesCount'](this.thread['.key'])
    },
    contributorsCount () {
      return countObjectProperties(this.thread.contributors)
    }
  },
  created () {
    this.$store.dispatch('threads/fetchThread', {id: this.id})
    .then(thread => this.$store.dispatch('posts/fetchPosts', {ids: Object.keys(thread.posts)}))
    .then(posts => Promise.all(
      posts.map(post => this.$store.dispatch('users/fetchUser', {id: post.userId}))
    ))
    .then(() => this.asyncDataStatus_fetched())
  }
}
</script>

<style>

</style>