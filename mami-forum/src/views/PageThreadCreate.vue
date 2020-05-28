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
    ref="editor"
    v-on:save='save'
    v-on:cancel='cancel'
    />
  </div>
   <!-- ref is used to get what state of title and text in ThreadEditor since this parent doesn know anything about  it-->
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
      this.$store.dispatch('threads/createThread', {
        forumId: this.forum['.key'],
        title,
        text
      }).then(thread => {
        this.saved = true
        this.$router.push({name: 'PageThreadShow', params: {id: thread['.key']}})
      })
    },
    cancel () {
      this.$router.push({name: 'PageForum', params: {id: this.forum['.key']}})
    }
  },
  data () {
    return {
      saved: false
    }
  },

  computed: {
    forum () {
      return this.$store.state.forums.items[this.forumId]
    },

    hasUnsavedChages () {
      // the editor has title and text but not saved yet,
      // this computed property make sure that window.confirm wont called when user click publish button
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  created () {
    this.$store.dispatch('forums/fetchForum', {id: this.forumId})
    .then(() => this.asyncDataStatus_fetched())
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChages) { // access child state with editor refs
      const confirmed = window.confirm('Are you sure? any changes will be discarded')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style>

</style>