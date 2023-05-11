<template>
<v-dialog
   v-model="dialogDeleteTrigger"
   max-width="500px"
   persistent
>
   <v-card>
      <v-card-title>{{ dialog ? dialog.title : '' }}</v-card-title>
      <v-card-text>
         Anda yakin ingin menghapus data <code>{{ targetItem.id }}</code>?
      </v-card-text>
      <v-card-text>
         <v-alert
            border="left"
            text
            color="red"
            type="warning"
            icon="mdi-alert"
         >Aksi ini tidak bisa dibatalkan</v-alert>
      </v-card-text>
      <v-card-text class="d-flex justify-end">
         <v-btn class="me-2" text @click="closeDelete">Batal</v-btn>
         <v-btn color="red darken-2" depressed class="white--text" @click="confirmDelete(targetItem)">Hapus</v-btn>
      </v-card-text>
   </v-card>
</v-dialog>
</template>

<script>
import {mapState} from 'vuex'
export default {
   data() {
      return {
         targetItem: {}
      }
   },

   computed: {
      ...mapState(['dialog', 'data', 'dialogDeleteTrigger'])
   },

   watch: {
      data() {
         if (this.data) {
            this.targetItem = {
               id: this.data.id,
               data_type_id: this.data.data_type_id,
            }
         }
      }, 
   },

   methods: {
      closeDelete() {
         this.targetItem = []
         this.$store.dispatch('closeDialog')
      },

      async confirmDelete(item) {
         await this.$axios.delete(`/data/${item.id}/delete`, {data: item}).then((resp) => {
            this.$store.dispatch('setAlert', {
               type: 'warning',
               color: 'red darken-2',
               icon: 'mdi-alert-outline',
               message: `Data <code>${item.id}</code> berhasil dihapus`
            })
            this.closeDelete()
            this.$emit('delete')
            this.$store.dispatch('showAlert')
         })
      }
   }
}
</script>