<template>
  <div class="col-full push-top">\
    <h1>You are editing <i>{{thread.name}}</i></h1>
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
      return this.$store.state.posts[this.thread.firstPostId].text
    }
  }
}
</script>

<style>

</style>