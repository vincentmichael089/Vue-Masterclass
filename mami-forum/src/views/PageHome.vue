<template>
  <div class="col-full push-top">
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
