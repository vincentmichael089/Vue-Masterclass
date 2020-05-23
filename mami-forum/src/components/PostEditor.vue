<template>
  <div>
    <!--
      save event triggered on submit
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
      // if post is exist (editing) return post text, if it isnt return ''
      postData: this.post ? this.post.text : ''
    }
  },
  props: {
    threadId: {
      required: false
    },
    post: {
      type: Object
    }
  },
  computed: {
    isUpdate () {
      // if received post object then updating post it is
      return !!this.post
    }
  },
  methods: {
    save () {
      this.persist()
        .then(post => { // handle the promiseg
          this.$emit('save', {post})
        })
    },

    create () {
      const post = {
        text: this.postData,
        threadId: this.threadId
      }
      this.postData = ''
      return this.$store.dispatch('createPost', post) // return a promise (check store)
    },

    update () {
      const payload = {
        id: this.post['.key'],
        newText: this.postData
      }

      return this.$store.dispatch('updatePost', payload) // return a promise (check store)
    },

    persist () {
      return this.isUpdate ? this.update() : this.create()
    }
  }
}
</script>

<style>

</style>