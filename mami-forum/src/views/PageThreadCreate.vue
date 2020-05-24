<template>
  <div class="col-full push-top" v-if="forum">
    <!--
      save event triggered on emitted event
      @event save

      cancel event triggered on emitted cancel
      @even cancel
    -->
    <h1>Create new thread in <i>{{forum.name}}</i></h1>
    <ThreadEditor
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
    forumId: {
      type: String,
      required: true
    }
  },
  methods: {
    save ({title, text}) {
      this.$store.dispatch('createThread', {
        forumId: this.forum['.key'],
        title,
        text
      }).then(thread => this.$router.push({name: 'PageThreadShow', params: {id: thread['.key']}}))
    },
    cancel () {
      this.$router.push({name: 'PageForum', params: {id: this.forum['.key']}})
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums[this.forumId]
    }
  },
  created () {
    this.$store.dispatch('fetchForum', {id: this.forumId})
  }
}
</script>

<style>

</style>