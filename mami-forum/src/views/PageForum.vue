<template>
  <div class="forum-wrapper" v-if="asyncDataStatus_ready">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link
          v-bind:to="{name: 'PageThreadCreate', params: {forumId: this.forum['.key']}}"
          class="btn-green btn-small"
        >
          Start a thread
        </router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList v-bind:threads="threads"/>
    </div>
  </div>
</template>

<script>
    import ThreadList from '@/components/ThreadList'
    import asyncDataStatus from '@/mixins/asyncDataStatus'

    export default {
      components: {
        ThreadList
      },
      props: {
        id: {
          type: String,
          required: true
        }
      },
      mixins: [asyncDataStatus],
      computed: {
        forum () {
          return this.$store.state.forums.items[this.id]
        },
        threads () {
          return Object.values(this.$store.state.threads.items)
            .filter(thread => thread.forumId === this.id)
        }
      },
      created () {
        this.$store.dispatch('forums/fetchForum', {id: this.id})
        .then(forum => this.$store.dispatch('threads/fetchThreads', {ids: forum.threads}))
        .then(threads => Promise.all(
          threads.map(thread => this.$store.dispatch('users/fetchUser', {id: thread.userId}))
        ))
        .then(() => this.asyncDataStatus_fetched())
      }
    }
</script>

<style scoped>
  .forum-wrapper {
    width: 100%;
  }
</style>