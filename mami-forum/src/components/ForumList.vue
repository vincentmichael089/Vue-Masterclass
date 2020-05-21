<template>
 <div>
    <!--
      @ForumListItem
        @binding {Object} forum forum item
    -->
    <ForumListItem
      v-for="forum in forums"
      v-bind:forum="forum"
      v-bind:key="forum['.key']"
    />
  </div>
</template>

<script>
import ForumListItem from '@/components/ForumListItem'

export default {
  components: {
    ForumListItem
  },
  props: {
    forums: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>