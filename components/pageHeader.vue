<template>
   <div class="d-block d-md-flex justify-space-between align-center mt-5 mb-8">
      <p class="text-h6 mb-0">{{ title }}</p>
      <app-breadcrumb/>
   </div>
</template>

<script>
export default {
   props: {
      title: {
         type: String,
         default: ''
      }
   }
}
</script>