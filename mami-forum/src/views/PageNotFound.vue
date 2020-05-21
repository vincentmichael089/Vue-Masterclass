<template>
  <div class="col-full">
    <h1>Whoopsie doopsie! we found nothing here! </h1>
    <p>We couldn't find the page you're looking for :(
      <router-link v-bind:to="{name: 'PageHome'}">Back to Home</router-link>
    </p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
  h1 {
    padding: 20% 20% 2% 20%;
    font-size: 2em;
  }
  p {
    font-weight: 700;
    font-size: 1em;
  }
  div {
    text-align: center;
    font-size: 1.2em;
  }
</style>