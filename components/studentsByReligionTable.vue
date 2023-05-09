<!--  -->
<template>
   <div>
      <v-data-table
         :headers="headers"
         :items="items"
         :loading="loading"
         hide-default-footer
      >
         <!-- eslint-disable vue/no-template-shadow, eslint-disable-next-line vue/valid-v-slot -->
         <template #item.grade="{ item }">
               Kelas {{ item.grade }}
         </template>
      </v-data-table>
   </div>
</template>

<script>
export default {
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
      items: {
         type: Array,
         default: () => {}
      },
      loading: {
         type: Boolean,
         default: false
      },
   }
}
</script>