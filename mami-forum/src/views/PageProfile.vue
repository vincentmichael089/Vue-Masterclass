<template>
  <div class="flex-grid">
    <!--
      @UserProfileCardEditor
        @binding {Object} user user
        @binding {Number} userPostsCount count posts by user
        @binding {Number} userThreadsCount count threads by user
    -->
    <UserProfileCardEditor 
    v-if="edit"
    v-bind:user="user"
    v-bind:userPostsCount="userPostsCount"
    v-bind:userThreadsCount="userThreadsCount"
    />

    <!--
      @UserProfileCard
        @binding {Object} user user
        @binding {Number} userPostsCount count posts by user
        @binding {Number} userThreadsCount count threads by user
    -->
    <UserProfileCard
    v-else
    v-bind:user="user"
    v-bind:userPostsCount="userPostsCount"
    v-bind:userThreadsCount="userThreadsCount"
    />

    <div class="col-7 push-top">

      <div class="profile-header">
        <span class="text-lead">
            {{user.name}}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr>
      <!--
        @PostList
          @binding {Array} posts posts by user
      -->
      <PostList v-bind:posts="userPosts"/>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard'
import UserProfileCardEditor from '@/components/UserProfileCardEditor'
import {mapGetters} from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  mixins: [asyncDataStatus],
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
    computed: {
      ...mapGetters({
        user: 'auth/authUser'
      }),
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    },
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },
    userPosts () {
      return this.$store.getters['users/userPosts'](this.user['.key'])
    }
  },

  created () {
    this.$store.dispatch('posts/fetchPosts', {ids: this.user.posts})
    .then(() => this.asyncDataStatus_fetched())
  }
}
</script>

<style>

</style>