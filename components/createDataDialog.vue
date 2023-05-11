<template>
<v-dialog
   v-model="dialogNewTrigger"
   persistent
   max-width="800"
>
   <v-card>
      <v-card-title>
         {{ dialogTitle }}
      </v-card-title>
      <!-- //SECTION - New Form -->
      <v-form ref="newForm" @submit.prevent="submit">
         <v-card-text>
            <v-row>
               <v-col cols="12" md="6">
                  <v-text-field
                     :value="$auth.user.name"
                     label="Nama Sekolah"
                     hint="Hanya baca"
                     persistent-hint
                     readonly
                  ></v-text-field>
               </v-col>
               <v-col cols="12" md="6">
                  <v-select
                     v-model="targetItem.data_status_id"
                     :items="formUtils ? formUtils.status : []"
                     item-text="name"
                     item-value="id"
                     label="Status"
                     readonly
                     hint="Hanya baca"
                     persistent-hint
                  ></v-select>
               </v-col>
               <v-col cols="12" md="6">
                  <v-select
                     v-model="selectedCategory"
                     :items="categories"
                     item-text="name"
                     item-value="id"
                     label="Kategori"
                     :rules="formSelectRules"
                     @input="getDataTypes(selectedCategory)"
                  ></v-select>
               </v-col>
               <v-col cols="12" md="6">
                  <v-select
                     v-model="targetItem.data_type_id"
                     :items="dataTypes"
                     item-text="name"
                     item-value="id"
                     :rules="formSelectRules"
                     label="Tipe Data"
                  ></v-select>
               </v-col>
               <v-col cols="12" md="6">
                  <v-file-input
                     v-model="targetItem.file"
                     accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                     label="Upload File"
                     :rules="formFileRules"
                     truncate-length="30"
                     required
                  ></v-file-input>
               </v-col>
               <v-col cols="12" md="6">
                  <v-select
                     v-model="targetItem.year"
                     :items="formUtils ? formUtils.year_list : []"
                     :rules="formSelectRules"
                     label="Tahun Ajaran"
                  ></v-select>
               </v-col>
               <v-col cols="12" class="d-flex justify-end">
                  <v-btn class="me-2" depressed @click="closeDialog">Batal</v-btn>
                  <v-btn type="submit" depressed color="primary">Simpan</v-btn>
               </v-col>
            </v-row>
         </v-card-text>
      </v-form>
      <!-- //!SECTION -->
   </v-card>
</v-dialog>
</template>

<script>
import crypto from 'crypto'
import { mapState } from 'vuex'
export default {
   data() {
      return {
         targetItem: {},

         selectedCategory: null,
         categories: null,
         dataTypes: null,
         dialogTitle: ''
      }
   },

   computed: {
      ...mapState(['data', 'dialogNewTrigger', 'dialog', 'formUtils']),

      formTextRules() {
         const data = [val => (val || '').length > 0 || 'Wajib diisi']
         return data
      },

      formSelectRules() {
         const data = [v => !!v || 'Wajib diisi']
         return data
      },
      
      formFileRules() {
         const data = [value => !!value || 'Wajib diisi']
         return data
      },
   },

   watch: {
      data() {
         if (this.data) {
            this.targetItem = {
               data_type_id: this.data.data_type_id,
               data_status_id: this.data.data_status_id,
               school_id: this.data.school_id,
               file: this.data.file,
               path: this.data.path,
               year: this.data.year
            }
            
            if (this.dialog && this.dialog.type === 'new') {
               this.$refs.newForm.resetValidation()
            }
         }
      },

      dialog() {
         if (this.dialog) {
            this.dialogTitle = this.dialog.title
         }
         // this.$refs.newForm.resetValidation()
      },
      
      formUtils() {
         if (this.formUtils) {
            this.categories = this.formUtils.categories
         }
      }
   },

   methods: {
      async getDataTypes(categoryId) {
         let selectedCategory = null
         this.categories.forEach((item) => {
            if (item.id === categoryId) {
               selectedCategory = item
            }
         })

         await this.$axios.get(`/getDataTypes`, {
            params: {
               slug: selectedCategory.slug
            }
         }).then((resp) => {
            this.dataTypes = resp.data.data
         })
         this.targetItem.data_type_id = 0
         this.selectedCategory = selectedCategory
      },

      closeDialog() {
         this.targetItem = {}
         this.categories = null
         this.selectedCategory = null
         this.dataTypes = null
         this.$store.dispatch('closeDialog')
      },

      async submit() {
         if (this.$refs.newForm.validate()) {
            const filePath = this.generateRandomString(40)
            const fileExtension = this.getFileExtension(this.targetItem.file.name)
            this.targetItem.file = this.renameFile(this.targetItem.file, filePath, fileExtension, {type: this.targetItem.file.type})

            this.targetItem.path = this.targetItem.file.name

            const formData = new FormData()
            for (const item in this.targetItem) {
               formData.append(`${item}`, this.targetItem[item])
            }

            await this.$axios.post(`/data/create`, formData).then((resp) => {
               this.$store.dispatch('setAlert' , {
                  type: 'info',
                  color: 'green darken-1',
                  icon: 'mdi-information-outline',
                  message: `Data baru berhasil dibuat. ID data: <code>${resp.data.data.id}</code>`,
               })
               this.closeDialog()
               this.$emit('submit')
               this.$store.dispatch('showAlert')
            })

            this.$store.dispatch('')
         }
      },

      generateRandomString(length) {
         return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length)
      },

      renameFile(file, name, extension, options) {
         try {
            return new File([file], new Date().valueOf() + '_' + name + extension, options)
         } catch (e) {
            const blobData = new Blob(file)
            blobData.lastModified = new Date()
            blobData.name = name
            return blobData
         }
      },

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

      wait(ms) {
         return new Promise(resolve => setTimeout(resolve, ms))
      },
   }
}
</script>