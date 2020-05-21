<template>
  <div class="col-full">
    <h1>Welcome to Mami-forum!</h1>
    <!--
      @CategoryList
        @binding {Array} categories categories list
    -->
    <CategoryList v-bind:categories="categories"/>

  </div>
</template>

<script>
import sourceData from '@/data.json'
import CategoryList from '@/components/CategoryList.vue'

export default {
  name: 'PageHome',
  data () {
    return {
      // transform data to array
      categories: Object.values(sourceData.categories)
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
