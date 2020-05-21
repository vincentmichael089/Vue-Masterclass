<template>
  <!--
    @div
      @binding {string} date date in human language
  -->
  <span
    class="post-date text-faded"
    v-bind:title="date | humaneDate"
    >
    {{date | diffDate}}
  </span>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    date: {
      type: Number,
      required: true
    }
  },
  filters: {
    humaneDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    diffDate (date) {
      return moment.unix(date).fromNow()
    }
  }
}
</script>

<style>

</style>