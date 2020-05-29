<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <!--
        register event triggered on submit event
        @event submit
      -->
      <form v-on:submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
          v-on:blur="$v.form.name.$touch()"
          v-model="form.name" id="name" type="text" class="form-input">
          <template v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="form-error">name is required</span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
          v-on:blur="$v.form.username.$touch()"
          v-model.lazy="form.username" id="username" type="text" class="form-input">
           <template v-if="$v.form.username.$error">
            <span v-if="!$v.form.username.required" class="form-error">username is required</span>
            <span v-if="!$v.form.username.unique" class="form-error">username already in use</span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
          v-on:blur="$v.form.email.$touch()"
          v-model.lazy="form.email" id="email" type="email" class="form-input">
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">email is required</span>
            <span v-else-if="!$v.form.email.email" class="form-error">not a valid email address</span>
            <span v-else-if="!$v.form.email.unique" class="form-error">email already in use</span>
          </template>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
          v-on:blur="$v.form.password.$touch()"
          v-model="form.password" id="password" type="password" class="form-input">
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">password is required</span>
            <span v-else-if="!$v.form.password.minLength" class="form-error">minimum of 6 characters</span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input 
          v-on:blur="$v.form.avatar.$touch()"
          v-model="form.avatar" id="avatar" type="text" class="form-input">
          <template v-if="$v.form.avatar.$error">
            <span v-if="!$v.form.avatar.url" class="form-error">not an image url</span>
            <span v-else-if="!$v.form.avatar.supportedImageFile" class="form-error">image format not supported</span>
          </template>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>

      </form>
      <div class="text-center push-top">
        <button v-on:click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {required, email, minLength, url, helpers as vuelidateHelpers} from 'vuelidate/lib/validators'
import firebase from 'firebase'
export default {
  data () {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        unique (value) {
          if (!vuelidateHelpers.req(value)) {
            return true
          }
          return new Promise((resolve, reject) => {
            firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
              .once('value', snapshot => resolve(!snapshot.exists()))
          })
        }
      },
      email: {
        required,
        email,
        unique (value) {
          if (!vuelidateHelpers.req(value)) {
            return true
          }
          return new Promise((resolve, reject) => {
            firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
              .once('value', snapshot => resolve(!snapshot.exists()))
          })
        }
      },
      password: {
        required,
        minLength: minLength(6)
      },
      avatar: {
        url,
        supportedImageFile (value) {
          if (!vuelidateHelpers.req(value)) {
            return true
          }

          const supported = ['jpg', 'jpeg', 'gif', 'png', 'svg']
          const suffix = value.split('.').pop() // split string by dot, and extract the last item (ext of files)
          return supported.includes(suffix) // return boolean if contained in supported
        }
        // ,responseOk (value) { // make sure image is obtainable
        //   if (!vuelidateHelpers.req(value)) {
        //     return true
        //   }
        //   return new Promise((resolve, reject) => {
        //     fetch(value)
        //       .then(response => resolve(response.ok))
        //       .catch(() => resolve(false))
        //   })
        // }
      }
    }
  },
  methods: {
    register () {
      // check all fields by touch it all
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return // break the register method if form is invalid
      }

      this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
      .then(() => this.successRedirect())
    },

    registerWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => this.successRedirect())
    },

    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || {name: 'PageHome'}
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>
</style>