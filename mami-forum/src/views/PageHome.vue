<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready">
    <h1>Welcome to Mami-forum!</h1>
    <!--
      @CategoryList
        @binding {Array} categories categories list
    -->
    <CategoryList v-bind:categories="categories"/>

  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'PageHome',
  computed: {
    categories () {
      return Object.values(this.$store.state.categories.items)
    }
  },
  components: {
    CategoryList
  },

  mixins: [asyncDataStatus],

  beforeCreate () {
    this.$store.dispatch('categories/fetchAllCategories')
      .then(categories => {
        Promise.all(categories.map(category => {
          this.$store.dispatch('forums/fetchForums', {ids: Object.keys(category.forums)})
        }))
      })
      .then(() => { this.asyncDataStatus_fetched() })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
