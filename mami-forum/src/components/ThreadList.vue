<template>
  <div class="thread-list">
    <h2 class="list-title">Threads</h2>  
    <!--
      @ThreadListItem
        @binding {Array} thread thread in threads
        @binding {string} key key of the post
    -->
    <ThreadListItem 
      v-for="thread in threads" 
      v-bind:thread="thread"
      v-bind:key="thread.key">
    </ThreadListItem>
  </div>
</template>

<script>
import ThreadListItem from '@/components/ThreadListItem'

export default {
  name: 'ThreadList',
  components: {
    ThreadListItem
  },
  props: {
    threads: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>