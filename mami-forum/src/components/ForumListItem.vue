<template>
  <div class="forum-listing">
    <div class="forum-details">
      <!--
        @router-link
          @binding {0bject} to navigate to route PageForum
      -->
      <router-link
        class="text-xlarge"
        v-bind:to="{name: 'PageForum', params: {id: forum['.key']}}"
      >
        {{forum.name}}
      </router-link>
      <p>{{forum.description}}</p>
    </div>

    <div class="threads-count">
      <p class="count">{{threadsCount}}</p>
      {{threadsCount === 1 ? 'thread' : 'threads'}}
    </div>

    <div class="last-thread">
      <!-- TODO: implement later -->
    </div>
  </div>
</template>
<script>
import {countObjectProperties} from '@/utils'

export default {
  name: 'ForumListItem',
  props: {
    forum: {
      type: Object,
      required: true
    }
  },
  computed: {
    threadsCount () {
      return countObjectProperties(this.forum.threads)
    }
  }
}
</script>

<style>

</style>