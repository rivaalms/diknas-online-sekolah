<template>
<div class="h-100 d-flex flex-column justify-center align-center bg-white">
    <v-img v-if="error.statusCode === 404" contain height="100" src="/404.png" alt=""/>
    <v-img v-else-if="error.statusCode === 401" contain height="100" src="/401.png" alt=""/>
    <v-img v-else-if="error.statusCode === 500" contain height="100" src="/500.png" alt=""/>
    <v-img v-else contain height="100" src="/error.png" alt=""/>

    <v-btn router exact to="/" depressed color="primary" class="my-8">Halaman Utama</v-btn>
</div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  
  head() {
    const title =
      this.error.statusCode
    return {
      title,
    }
  },
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.bg-white {
  background-color: white;
}
</style>
