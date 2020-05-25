<template>
  <div class="col-full push-top" v-if="ready">
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

export default {
  name: 'PageHome',
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },
  components: {
    CategoryList
  },

  data () {
    return {
      ready: false
    }
  },

  beforeCreate () {
    this.$store.dispatch('fetchAllCategories')
      .then(categories => {
        Promise.all(categories.map(category => {
          this.$store.dispatch('fetchForums', {ids: Object.keys(category.forums)})
        }))
      })
      .then(() => { this.ready = true })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
