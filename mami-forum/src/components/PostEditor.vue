<template>
  <div>
    <!--
      trigered on submit
      @event submit
    -->
    <form v-on:submit.prevent="save">
      <div class="form-group">
        <textarea 
          v-model="postData"
          name="" id="" cols="30" rows="10" class="form-input"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Reply</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      postData: ''
    }
  },
  props: {
    threadId: {
      required: true
    }
  },
  methods: {
    save () {
      const postId = Date.now() + Math.random()

      const post = {
        '.key': postId,
        publishedAt: Math.floor(Date.now() / 1000),
        text: this.postData,
        threadId: this.threadId,
        userId: 'jUjmgCurRRdzayqbRMO7aTG9X1G2'
      }

      this.$emit('savePost', {post: post})
      this.newReply = ''
    }
  }
}
</script>

<style>

</style>