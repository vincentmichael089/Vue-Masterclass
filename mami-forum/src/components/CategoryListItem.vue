<template>
  <div class="forum-list">
    <h2 class="list-title">
      <!--
        @router-link
          @binding {Object} to route to category
      -->
      <router-link 
      v-bind:to="{name: 'PageCategory', params: {id: category['.key']}}">
        {{ category.name }}
      </router-link>
    </h2>

    <ForumList v-bind:forums="categoryForums"/>
  </div>
</template>


<script>
import ForumList from '@/components/ForumList'

export default {
  name: 'CategoryListItem',
  components: {
    ForumList
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    categoryForums () {
      return Object.values(this.$store.state.forums.items)
      .filter(forum => forum.categoryId === this.category['.key'])
    }
  }
}
</script>

<style>

</style>