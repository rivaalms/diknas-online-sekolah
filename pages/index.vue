<template>
<v-row justify="center" align="center">
   <v-col cols="12" sm="8" md="6">

   </v-col>
</v-row>
</template>

<script>
import api from '@/helpers/api'

export default {
   name: 'IndexPage',

   data() {
      return {
      }
   },
   
   async mounted() {
      const data = await api.getSchool(1)

      console.log("mounted ~ data:", data)
   }
}
</script>
