<template>
  <div class="col-full" v-if="asyncDataStatus_ready">
    <h1>{{ category.name }}</h1>
    <CategoryListItem v-bind:category="category"/>
  </div>
</template>

<script>
import CategoryListItem from '@/components/CategoryListItem'
import asyncDataStatus from '@/mixins/asyncDataStatus'

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
  mixins: [asyncDataStatus],
  computed: {
    category () {
      return this.$store.state.categories.items[this.id]
    }
  },
  created () {
    this.$store.dispatch('categories/fetchCategory', {id: this.id})
    .then(category => {
      this.$store.dispatch('forums/fetchForums', {ids: category.forums})
    })
    .then(() => this.asyncDataStatus_fetched())
  }
}
</script>

<style>

</style>