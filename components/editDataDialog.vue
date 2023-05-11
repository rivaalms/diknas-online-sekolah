<template>
   <v-dialog
      v-model="dialogEditTrigger"
      persistent
      max-width="1200"
   >
      <v-card>
         <v-card-title>
            {{ dialogTitle }}
         </v-card-title>
         <!-- //SECTION - Edit Form -->
         <v-card-text>
            <v-row>
               <v-col>
                  <p id="revisionText" class="text-subtitle-2">Catatan Revisi</p>
                  <div id="scrollerContainer" class="overflow-x-hidden overflow-y-auto">
                     <v-row dense>
                        <v-col v-for="note in revision" :key="note.id" cols="12">
                           <v-card flat outlined>
                              <v-card-title class="text-caption font-weight-medium">
                                 {{ note.date }}
                              </v-card-title>
                              <v-card-text>
                                 {{ note.note }}
                              </v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </div>
               </v-col>
               <v-col>
                  <v-form id="editForm" ref="editForm" enctype="multipart/form-data" @submit.prevent="submit">
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
                              hint="Hanya baca"
                              persistent-hint
                              readonly
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
                              label="Tipe Data"
                              :rules="formSelectRules"
                           ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                           <v-file-input
                              v-model="targetItem.file"
                              accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                              label="Upload File"
                              truncate-length="30"
                              :rules="formFileRules"
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
                           <v-btn depressed class="me-2" @click="closeDialog">Batal</v-btn>
                           <v-btn type="submit" depressed color="primary">Simpan</v-btn>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-col>
            </v-row>
         </v-card-text>
         <!-- //!SECTION -->
   
      </v-card>
   </v-dialog>
   </template>
   
   <script>
   import crypto from 'crypto'
   import { mapState } from 'vuex'

   export default {
      // props: {
      //    trigger: {
      //       type: Boolean,
      //       default: false
      //    }
      // },

      data() {
         return {
            targetItem: {},
            selectedCategory: null,
            categories: null,
            dataTypes: null,
            dialogTitle: '',
         }
      },
   
      computed: {
         ...mapState(['data', 'dialogEditTrigger', 'dialog', 'formUtils', 'revision']),

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
         dialog() {
            if (this.dialog) {
               this.dialogTitle = this.dialog.title
            }
         },

         data() {
            if (this.data) {
               this.targetItem = {
                  id: this.data.id,
                  data_type_id: this.data.data_type_id,
                  data_type: this.data.data_type,
                  data_status_id: this.data.data_status_id,
                  school_id: this.data.school_id,
                  file: this.data.file,
                  old_path: this.data.old_path,
                  path: this.data.path,
                  year: this.data.year
               }
               if (this.dialog && this.dialog.type === 'edit') {
                  this.$refs.editForm.resetValidation()
               }
            }
         },

         formUtils() {
            if (this.formUtils) {
               this.selectedCategory = this.formUtils.selected_category
               this.categories = this.formUtils.edit_categories
               this.dataTypes = this.formUtils.data_types
            }
         },
   
         revision() {
            if (this.revision) {
               this.getRevisionScrollerHeight()
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

         wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
         },
   
         getRevisionScrollerHeight() {
            const formHeight = document.getElementById('editForm').offsetHeight
            const textHeight = document.getElementById('revisionText').offsetHeight
            this.scrollerHeight = formHeight - textHeight - 24 /* col padding */ - 16 /* text margin */
            document.getElementById('scrollerContainer').setAttribute('style', `max-height: ${this.scrollerHeight}px!important`)
         },

         closeDialog() {
            this.targetItem = {}
            this.categories = null
            this.selectedCategory = null
            this.dataTypes = null
            this.$store.dispatch('closeDialog')
         },

         async submit() {
            if (this.$refs.editForm.validate()) {
               const filePath = this.generateRandomString(40)
               const fileExtension = this.getFileExtension(this.targetItem.file.name)

               this.targetItem.file = this.renameFile(this.targetItem.file, filePath, fileExtension, {type: this.targetItem.file.type})
               this.targetItem.path = this.targetItem.file.name

               const formData = new FormData()
               for (const item in this.targetItem) {
                  formData.append(`${item}`, this.targetItem[item])
                  formData.append('_method', 'PUT')
               }

               await this.$axios.post(`/school/data/${this.targetItem.id}/update`, formData)
               this.$store.dispatch('setAlert', {
                  type: 'info',
                  color: 'light-blue darken-1',
                  icon: 'mdi-information-outline',
                  message: `Data <code>${this.targetItem.id}</code> berhasil disunting`,
               })
               this.closeDialog()
               this.$emit('submit')
               this.$store.dispatch('showAlert')
            }
         },

         generateRandomString(length) {
            return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length)
         },

         getFileExtension(name) {
            const fileName = name
            const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
            return extension
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
      }
   }
   </script>