<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready">
    <h1>You are editing <i>{{thread.title}}</i></h1>
    <!--
      save event triggered on emitted event
      @event save

      cancel event triggered on emitted cancel
      @even cancel

      @ThreadEditor
        @binding {string} title title of the thread
        @binding {string} text text of the thread
    -->
    <ThreadEditor
    v-bind:title='thread.title'
    v-bind:text='text'
    v-on:save='save'
    v-on:cancel='cancel'
    />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  methods: {
    save ({title, text}) {
      this.$store.dispatch('updateThread', {
        id: this.id,
        title,
        text
      }).then(thread => this.$router.push({name: 'PageThreadShow', params: {id: this.id}}))
    },
    cancel () {
      this.$router.push({name: 'PageThreadShow', params: {id: this.id}})
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    text () {
      // firstPostId is the first post or the beginning of the thread, so editing it means editing the thread post
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    }
  },
  created () {
    this.$store.dispatch('fetchThread', {id: this.id})
    .then(thread => this.$store.dispatch('fetchPost', {id: thread.firstPostId}))
    .then(() => this.asyncDataStatus_fetched())
  }
}
</script>

<style>

</style>