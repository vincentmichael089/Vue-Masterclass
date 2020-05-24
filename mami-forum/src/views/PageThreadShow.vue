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
    // fetch thread
    firebase.database().ref('threads').child(this.id).once('value', snapshot => {
      const thread = snapshot.val()
      const threadId = snapshot.key
      this.$store.commit('setThread', {thread: {...thread, '.key': threadId}, threadId: threadId})

      // // fetch posts user (this is comented because the fetch user below also fetch the same data)
      // firebase.database().ref('users').child(thread.userId).once('value', snapshot => {
      //   const user = snapshot.val()
      //   const userId = snapshot.key
      //   this.$store.commit('setUser', {userId, userData: {...user, '.key': userId}})
      // })

      // fetch post
      Object.keys(thread.posts).forEach(postId => {
        firebase.database().ref('posts').child(postId).once('value', snapshot => {
          const post = snapshot.val()
          const postId = snapshot.key
          this.$store.commit('setPost', {post: {...post, '.key': postId}, postId})

          // fetch posts user
          firebase.database().ref('users').child(post.userId).once('value', snapshot => {
            const user = snapshot.val()
            const userId = snapshot.key
            this.$store.commit('setUser', {userId, userData: {...user, '.key': userId}})
          })
        })
      })
    })
  }
}
</script>

<style>

</style>