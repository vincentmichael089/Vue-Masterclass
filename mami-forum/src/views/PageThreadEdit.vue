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
    ref='editor'
    v-bind:title='thread.title'
    v-bind:text='text'
    v-on:save='save'
    v-on:cancel='cancel'
    />
    <!-- ref is used to get what state of title and text in ThreadEditor since this parent doesn know anything about  it-->  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import store from '@/store'
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
    },

    hasUnsavedChanges () {
      // this.saved is not required in this implementation because `this.thread.title` and `this.text` are reactive
      // Thus `hasUnsavedChanges` will automatically become false when the thread is updated
      return this.$refs.editor.form.title !== this.thread.title || this.$refs.editor.form.text !== this.text
    }
  },
  created () {
    this.$store.dispatch('fetchThread', {id: this.id})
    .then(thread => this.$store.dispatch('fetchPost', {id: thread.firstPostId}))
    .then(() => this.asyncDataStatus_fetched())
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) { // if form has unsaved changes
      const confirmed = window.confirm('Are you sure you want to leave? Any unsaved changes will be lost!')
      next(confirmed) // next if confirmed true, stay if confirmed is false
    } else { // else, there is no difference, can leave safely
      next()
    }
  }
}
</script>

<style>

</style>