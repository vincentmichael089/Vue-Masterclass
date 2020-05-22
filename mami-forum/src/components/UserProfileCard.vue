<template>
<div class="col-3 push-top">
  <div class="profile-card">
    <p class="text-center">
      <!--
        @img
          @binding {string} src src of avatar
      -->
      <img v-bind:src="user.avatar" alt="" class="avatar-xlarge">
    </p>

    <h1 class="title">{{user.username}}</h1>
    <p class="text-lead">{{user.name}}</p>

    <p class="text-justify">
      <span v-if="user.bio">{{user.bio}}</span>
      <span v-else>No bio specified.</span>
    </p>

    <span class="online">{{user.username}} is online</span>

    <div class="stats">
      <span>{{userPostsCount}} posts</span>
      <span>{{userThreadsCount}} threads</span>
    </div>
    <hr>
    <p v-if="user.website" class="text-large text-center"><i class="fa fa-globe"></i> 
      <!--
        @a
          @binding {string} href href of user website
      -->
      <a v-bind:href="user.website">{{user.website}}</a>
    </p>
    
    <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>
    <div class="text-center">
      <hr>
      <a href="edit-profile.html" class="btn-green btn-small">Edit Profile</a>
    </div>
  </div>    
</div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    userPostsCount: {
      type: Number,
      required: true
    },
    userThreadsCount: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
</style>