<template>
<v-snackbar
   v-model="snackbarTrigger"
   :color="snackbar ? snackbar.color : ''"
   text
   timeout="-1"
>
   {{ snackbar ? snackbar.message: '' }}

   <template #action="{ attrs }">
      <v-btn
         :color="snackbar ? snackbar.color : ''"
         text
         v-bind="attrs"
         @click="closeSnackbar"
      >
         Tutup
      </v-btn>
   </template>
</v-snackbar>
</template>

<script>
import {mapState} from 'vuex'
export default {
   computed: {
      ...mapState(['snackbar', 'snackbarTrigger']),
   },

   watch: {
      snackbarTrigger() {
         if (this.snackbarTrigger === true) {
            setTimeout(() => {
               this.closeSnackbar()
            }, 5000)
         }
      }
   },
   
   methods: {
      closeSnackbar() {
         this.$store.dispatch('clearSnackbar')
      }
   }
}
</script>