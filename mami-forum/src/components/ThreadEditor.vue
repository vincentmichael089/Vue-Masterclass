<template>
  <div>
    <!--
      save event triggered on submit
      @event submit
    -->
    <form v-on:submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input v-model="title" type="text" id="thread_title" class="form-input" name="title">
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea v-model="text" id="thread_content" class="form-input" name="content" rows="8" cols="140"></textarea>
      </div>

      <div class="btn-group">
        <!--
          emit cancel event on click
          @event click
        -->
        <button class="btn btn-ghost" v-on:click.prevent="cancel">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">Publish </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      title: ''
    }
  },
  methods: {
    save () {
      this.$emit('save', {title: this.title, text: this.text})
    },

    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>