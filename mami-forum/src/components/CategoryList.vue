<template>
  <div>
    <!--
      @CategoryListItem
        @binding {Object} forum forum item
    -->
    <CategoryListItem
      v-for="category in categories"
      v-bind:category="category"
      v-bind:key="category['.key']"
    />
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'

export default {
  components: {
    CategoryListItem
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>