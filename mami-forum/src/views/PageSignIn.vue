<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <!--
        signIn event triggered on submit event
        @event submit
      -->
      <form v-on:submit.prevent="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
          v-on:blur="$v.form.email.$touch()"
          v-model="form.email" id="email" type="text" class="form-input">
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">email cant be empty</span>
            <span v-else-if="!$v.form.email.email" class="form-error">email is not in email format</span>
          </template>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
          v-on:blur="$v.form.password.$touch()"
          v-model="form.password" id="password" type="password" class="form-input">
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">password required</span>
            <span v-if="!$v.form.password.minLength" class="form-error">password at least 6 characters</span>
          </template>
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <!--
            @router-link
              @binding {Object} to redirect to object name
          -->
          <router-link v-bind:to="{name: 'PageRegister'}">Create an account?</router-link>
        </div>
      </form>

      <div class="push-top text-center">
          <button v-on:click="signInWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Sign in with Google
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      form: {
        email: null,
        password: null
      }
    }
  },

  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },

  methods: {
    signIn () {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.$store.dispatch('auth/signInWithEmailAndPassword', {
          email: this.form.email,
          password: this.form.password
        })
        .then(() => this.successRedirect())
        .catch(error => alert(error.message))
      }
    },

    signInWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => this.successRedirect())
        .catch(error => alert(error.message))
    },

    successRedirect () {
      // redirect to redirect path or go to home if there isnt redirect path. notice it use route and not router
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