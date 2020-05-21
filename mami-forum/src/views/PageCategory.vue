<template>
  <div class="col-full">
    <h1>{{ category.name }}</h1>
    <CategoryListItem v-bind:category="category"/>
  </div>
</template>

<script>
import sourceData from '@/data.json'
import CategoryListItem from '@/components/CategoryListItem'

export default {
  name: 'PageCategory',
  components: {
    CategoryListItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return sourceData.categories[this.id]
    }
  }
}
</script>

<style>

</style>