<template>
  <div>
    <!--
      save event triggered on submit
      @event submit
    -->
    <form v-on:submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input v-model="form.title" type="text" id="thread_title" class="form-input" name="title">
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea v-model="form.text" id="thread_content" class="form-input" name="content" rows="8" cols="140"></textarea>
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
  data () {
    return {
      form: {
        text: this.title,
        title: this.text
      }
    }
  },
  methods: {
    save () {
      this.$emit('save', {title: this.form.title, text: this.form.text})
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