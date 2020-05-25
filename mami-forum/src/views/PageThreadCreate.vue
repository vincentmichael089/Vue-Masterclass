<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready">
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
import asyncDataStatus from '@/mixins/asyncDataStatus'

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
  mixins: [asyncDataStatus],
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
    .then(() => this.asyncDataStatus_fetched())
  }
}
</script>

<style>

</style>