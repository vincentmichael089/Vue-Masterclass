<template>
    <div class="post" v-if="post && user"><!--v-if added so the template aware if data is fetched from firebase-->
    <div class="user-info">
      <a href="#" class="user-name">{{user.name}}</a>
      <a href="#">
        <!--
          @img
            @binding {string} src src of the img
        -->
        <img class="avatar-large" v-bind:src="user.avatar" alt="">
      </a>
      <p class="desktop-only text-small">{{userThreadsCount}} threads</p>
      <p class="desktop-only text-small">{{userPostsCount}} posts</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div>
          {{post.text}}
        </div>
        <a v-on:click.prevent="editing = true" href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change"><i class="fa fa-pencil"></i></a>
      </template>
      <div v-else>
        <PostEditor
        v-on:save='editing=false'
        v-on:cancel='editing = false'
        v-bind:post='post'
        ></PostEditor>
      </div>
    </div>
    <div class="post-date text-faded">
      <div v-if="post.edited" class="edition-info">this post has been edited.</div>
      <!--
        @AppDate
          @binding {string} date created date of post
      -->
      <AppDate v-bind:date="post.publishedAt"/>
    </div>

  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor'

export default {
  name: 'PostListItem',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editing: false
    }
  },
  computed: {
    user () {
      return this.$store.state.users.items[this.post.userId]
    },
    userPostsCount () {
      return this.$store.getters['users/userPostsCount'](this.user['.key'])
    },
    userThreadsCount () {
      return this.$store.getters['users/userThreadsCount'](this.user['.key'])
    }
  },
  components: {
    PostEditor
  }
}
</script>

<style>

</style>