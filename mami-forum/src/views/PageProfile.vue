<template>
  <div class="flex-grid">
    <!--
      @UserProfileCard
        @binding {Object} user user
        @binding {Number} userPostsCount count posts by user
        @binding {Number} userThreadsCount count threads by user
    -->
    <UserProfileCardEditor
    v-bind:user="user"
    v-bind:userPostsCount="userPostsCount"
    v-bind:userThreadsCount="userThreadsCount"
    />

    <div class="col-7 push-top">

      <div class="profile-header">
        <span class="text-lead">
            Joker's recent activity
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
import {countObjectProperties} from '@/utils'

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  computed: {
    ...mapGetters({
      user: 'authUser'
    }),
    userThreadsCount () {
      return countObjectProperties(this.user.threads)
    },
    userPostsCount () {
      return countObjectProperties(this.user.posts)
    },
    userPosts () {
      if (this.user.posts) { // if user has posts
        return Object.values(this.$store.state.posts).filter(post => post.userId === this.user['.key'])
      }
      return []
    }
  }
}
</script>

<style>

</style>