<template>
  <header class="header" id="header">
    <!--
      @router-link
        @binding {route} to route to PageHome
    -->
    <router-link
      v-bind:to="{name: 'PageHome'}"
      class="logo"
    >
      <img src="../assets/img/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul v-if="user">
        <li class="navbar-user" v-click-outside="closeUserDropdown"> 
          <!--
            dropdown toggle triggered on click event
            @event click
          -->
          <a v-on:click.prevent="userDropdownOpen = !userDropdownOpen">
            <!--
              @img
                @binding {string} src src of avatar
            -->
            <img class="avatar-small" v-bind:src="user.avatar"
                 alt="">
            <span> 
                {{user.name}}
                <img class="icon-profile" src="../assets/img/arrow-profile.svg" alt="">
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" v-bind:class="{'active-drop': userDropdownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <!--
                  @router-link
                    @binding {route} route navigate to PageProfile
                -->
                <router-link v-bind:to="{name: 'PageProfile'}">View Profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <!--
                  signOut event triggered on click event
                  @event click
                -->
                <a v-on:click.prevent="$store.dispatch('auth/signOut')">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul v-else>
        <!--
          @li
            @binding {Object} to redirect to SignIn / Register
        -->
        <li class="navbar-item">
          <router-link v-bind:to="{name: 'PageSignIn'}">Sign In</router-link>
        </li>
        <li class="navbar-item">
          <router-link v-bind:to="{name: 'PageRegister'}">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
  import {mapGetters} from 'vuex'
  import clickOutside from '@/directives/click-outside'

  export default {
    directives: {
      clickOutside
    },

    data () {
      return {
        userDropdownOpen: false
      }
    },

    computed: {
      ...mapGetters({
        'user': 'auth/authUser' // pass the auth namespace
      })
    },

    methods: {
      closeUserDropdown () {
        this.userDropdownOpen = false
      }
    }
  }
</script>

<style scoped>
</style>