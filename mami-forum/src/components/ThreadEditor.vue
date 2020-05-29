<template>
  <div>
    <!--
      save event triggered on submit
      @event submit
    -->
    <form v-on:submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input 
        v-on:blur="$v.form.title.$touch()"
        v-model="form.title" type="text" id="thread_title" class="form-input" name="title">
        <template v-if="$v.form.title.$error">
          <span v-if="!$v.form.title.required" class="form-error">title required</span>
          <span v-if="!$v.form.title.minLength" class="form-error">title at least 10 character</span>
      </template>
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea 
        v-on:blur="$v.form.text.$touch()"
        v-model="form.text" id="thread_content" class="form-input" name="content" rows="8" cols="140"></textarea>
        <template v-if="$v.form.text.$error">
          <span v-if="!$v.form.text.required" class="form-error">content required</span>
          <span v-if="!$v.form.text.minLength" class="form-error">Type at least {{40 - form.text.length}} more</span>
      </template>
      </div>

      <div class="btn-group">
        <!--
          emit cancel event on click
          @event click
        -->
        <button class="btn btn-ghost" v-on:click.prevent="cancel">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">{{isUpdate ? 'Update' : 'Publish'}} </button>
      </div>
    </form>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(10)
      },
      text: {
        required,
        minLength: minLength(40)
      }
    }
  },
  data () {
    return {
      form: {
        text: this.text,
        title: this.title
      }
    }
  },
  methods: {
    save () {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.$emit('save', {title: this.form.title, text: this.form.text})
      }
    },

    cancel () {
      this.$emit('cancel')
    }
  },
  computed: {
    isUpdate () {
      return !!this.title
    }
  }
}
</script>

<style>

</style>