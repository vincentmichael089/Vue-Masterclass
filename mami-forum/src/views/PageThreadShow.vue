<template>
   <div class="col-large push-top">
    <h1>{{thread.title}}</h1>
    <!--
      @PostList
        @binding {Array} posts pass posts to PostList
    -->
    <PostList v-bind:posts="posts"/>
    
    <h3>Reply to this Thread</h3>
    <!--
      trigered on submit
      @event submit
    -->
    <form v-on:submit.prevent="addPost">
      <div class="form-group">
        <textarea 
          v-model="newReply"
          name="" id="" cols="30" rows="10" class="form-input"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Reply</button>
      </div>
    </form>
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
      thread: sourceData.threads[this.id],
      newReply: ''
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts) // post ids that belong to the thread
      return Object.values(sourceData.posts).filter(post => postIds.includes(post['.key'])) // change to array and find the post that is in posts
    }
  },
  methods: {
    addPost () {
      const postId = Date.now() + Math.random()

      const post = {
        '.key': postId,
        publishedAt: Math.floor(Date.now() / 1000),
        text: this.newReply,
        threadId: this.id,
        userId: 'jUjmgCurRRdzayqbRMO7aTG9X1G2'
      }

      // add post to list of posts
      // sourceData.posts[postId] = post // but this one is not reactive
      this.$set(sourceData.posts, postId, post) // with set it become reactive

      // append the post id to the thread
      // this.thread.posts[postId] = postId // but this one is not reactive
      this.$set(this.thread.posts, postId, postId) // with set it become reactive

      // append the post to the user
      this.$set(sourceData.users[post.userId].posts, postId, postId)
      this.newReply = ''
    }
  }
}
</script>

<style>

</style>