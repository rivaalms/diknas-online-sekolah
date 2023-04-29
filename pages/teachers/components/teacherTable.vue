<template>
   <div>
      <v-data-table
         :headers="headers"
         :items="items"
         :loading="loading"
         :items-per-page="10"
         :footer-props="{
            itemsPerPageText: 'Item per halaman:',
            itemsPerPageAllText: 'Semua',
            pageText: '{0}-{1} dari {2}'
         }"
      >
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.subject="{ item }">
            {{ (item.subject === 'math') ? 'Matematika' 
            : (item.subject === 'ind_lit') ? 'Bahasa Indonesia' 
            : (item.subject === 'eng_lit') ? 'Bahsa Inggris' 
            : (item.subject === 'science') ? 'Ilmu Pengetahuan Alam' 
            : (item.subject === 'social') ? 'Ilmu Pengetahuan Sosial' 
            :(item.subject === 'civic') ? 'Pendidikan Kewarganegaraan' 
            : (item.subject === 'islam') ? 'Pendidikan Agama Islam' 
            : (item.subject === 'catholic') ? 'Pendidikan Agama Katolik' 
            : (item.subject === 'protestant') ? 'Pendidikan Agama Protestan' 
            : (item.subject === 'hindu') ? 'Pendidikan Agama Hindu' 
            : (item.subject === 'buddha') ? 'Pendidikan Agama Buddha' 
            : (item.subject === 'konghucu') ? 'Pendidikan Agama Konghucu' 
            : (item.subject === 'counseling') ? 'Bimbingan Konseling' 
            : (item.subject === 'sports') ? 'Pendidikan Jasmani, Olahraga dan Kesehatan' 
            : (item.subject === 'art') ? 'Seni Budaya dan Keterampilan'
            : (item.subject === 'entrepreneurship') ? 'Kewirausahaan'
            : 'Total' }}
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
         default: () => []
      },
      loading: {
         type: Boolean,
         default: false
      },
   }
}
</script>