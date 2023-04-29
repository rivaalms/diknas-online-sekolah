<!-- eslint-disable vue/no-mutating-props -->
<template>
<div>
   <!-- //SECTION - Alert -->
   <v-alert
      :type="alertType"
      :color="alertColor"
      :icon="alertIcon"
      dismissible
      text
      transition="fade-transition"
      :value="alertTrigger"
      >
      <span id="alertMessage"></span>
   </v-alert>
   <!-- //!SECTION -->

   <!-- //SECTION - Status Filter & New Data Btn -->
   <div class="d-flex justify-space-between align-center">
      <div class="d-flex align-center flex-grow-1">
         <span class="me-2 text-subtitle-2">Filter: </span>
         <v-col cols="2">
            <v-select
               v-model="statusId"
               :items="status"
               item-text="name"
               item-value="id"
               label="Status"
               clearable
               hide-details="auto"
               class="pt-0 mt-0"
               @input="dataHandler()"
            ></v-select>
         </v-col>
      </div>
      <v-btn
         depressed
         color="primary"
         @click.stop="dialog()"
      >
         Input Data
      </v-btn>
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION - Data table -->
   <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- //SECTION - Status Chips -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.status="{item}">
         <v-chip
            class="font-weight-medium"
            :class="getColor(item.data_status_id)"
            pill
         >
            {{ item.status }}
         </v-chip>
      </template>
      <!-- //!SECTION -->

      <!-- //SECTION - Action Buttons -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="light-blue darken-2"
                  v-on="on"
                  @click="downloadFile(item)"
               >
                  <v-icon>mdi-file-download</v-icon>
               </v-btn>
            </template>
            <span>Download</span>
         </v-tooltip>

         <!-- <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
               v-bind="attrs"
                  icon
                  class="me-2"
                  color="amber darken-2"
                  v-on="on"
                  @click="dialog('edit', item)"
               >
                  <v-icon>mdi-pencil</v-icon>
               </v-btn>
            </template>
            <span>Sunting</span>
         </v-tooltip> -->

         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
               v-bind="attrs"
                  icon
                  :disabled="(item.data_status_id === 3) ? false : true"
                  class="me-2"
                  color="orange darken-2"
                  v-on="on"
                  @click="dialog('edit', item)"
               >
                  <v-icon>mdi-file-document-edit</v-icon>
               </v-btn>
            </template>
            <span>Revisi</span>
         </v-tooltip>

         <!-- <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
               v-bind="attrs"
                  icon
                  class="me-2"
                  color="red"
                  v-on="on"
                  @click="deleteItem(item)"
               >
                  <v-icon>mdi-delete</v-icon>
               </v-btn>
            </template>
            <span>Hapus</span>
         </v-tooltip> -->
      </template>
      <!-- //!SECTION -->
   </v-data-table>
   <!-- //!SECTION -->

   <!-- //SECTION - Table footer & Pagination -->
   <div v-if="items" class="d-flex justify-space-between align-center">
      <p class="text-caption mb-0">
         {{ from }}-{{ to }} dari {{ total }} data
      </p>
      <v-pagination
         v-model="current"
         elevation="0"
         :length="totalPage"
         total-visible="7"
         prev-icon="mdi-menu-left"
         next-icon="mdi-menu-right"
         @input="dataHandler()"
      ></v-pagination>
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION - Delete Dialog -->
   <v-dialog
      v-model="dialogDelete"
      max-width="500px"
      persistent
   >
      <v-card>
         <v-card-title>Hapus data?</v-card-title>
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
   <!-- //!SECTION -->

   <!-- //SECTION - Create/Edit Dialog -->
   <v-dialog
      v-model="dialogTrigger"
      persistent
      max-width="1200"
   >
      <v-card>
         <v-card-title>
            {{ dialogTitle }}
         </v-card-title>
         <!-- //SECTION - Edit Form -->
         <v-card-text v-if="isEdit && !isNew">
            <v-row>
               <v-col>
                  <p id="revisionText" class="text-subtitle-2">Catatan Revisi</p>
                  <div id="scrollerContainer" class="overflow-x-hidden overflow-y-auto">
                     <v-row dense>
                        <v-col v-for="note in revisions" :key="note.id" cols="12">
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
                  <!-- <v-virtual-scroll
                     bench="1"
                     :items="revisions"
                     item-height="110"
                     :max-height="scrollerHeight"
                  >
                     <template #default="{item}">
                        <v-card :key="item.id" flat outlined>
                           <v-card-text>
                              {{ item.note }}
                           </v-card-text>
                        </v-card>
                     </template>
                  </v-virtual-scroll> -->
               </v-col>
               <v-col>
                  <v-form id="editForm" ref="editForm" enctype="multipart/form-data" @submit.prevent="editSubmit">
                     <v-row>
                        <v-col cols="12" md="6">
                           <v-text-field
                              :value="school_name"
                              label="Nama Sekolah"
                              hint="Hanya baca"
                              persistent-hint
                              readonly
                           ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                           <v-select
                              v-model="targetItem.data_status_id"
                              :items="status"
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
                              :items="editCategories"
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
                              :items="editDataTypes"
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
                              :items="formYearList"
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

         <!-- //SECTION - New Form -->
         <v-form v-else-if="isNew && !isEdit" ref="newForm" @submit.prevent="newSubmit()">
            <v-card-text>
               <v-row>
                  <v-col cols="12" md="6">
                     <v-text-field
                        :value="school_name"
                        label="Nama Sekolah"
                        hint="Hanya baca"
                        persistent-hint
                        readonly
                     ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                     <v-select
                        v-model="targetItem.data_status_id"
                        :items="status"
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
                        :items="editCategories"
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
                        :items="editDataTypes"
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
                        :items="formYearList"
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
   <!-- //!SECTION -->

   <!-- //SECTION - Snackbar -->
   <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      text
   >
      {{ snackbarText }}

      <template #action="{ attrs }">
         <v-btn
            :color="snackbarColor"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Tutup
         </v-btn>
      </template>
   </v-snackbar>
   <!-- //!SECTION -->
</div>
</template>

<script>
import crypto from 'crypto'
// import { renameFile } from '~/utils/fileUtils.js'

export default {
   // SECTION - Props
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
      items: {
         type: Array,
         default: () => {}
      },
      totalPage: {
         type: Number,
         default: 0
      },
      currentPage: {
         type: Number,
         default: 0
      },
      loading: {
         type: Boolean,
         default: false
      },
      from: {
         type: Number,
         default: 0
      },
      to: {
         type: Number,
         default: 0
      },
      total: {
         type: Number,
         default: 0
      },
   },
   // !SECTION
   
   // SECTION - Data
   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         statusId: null,
         status: [],
         school_name: this.$auth.user.name,

         alertTrigger: false,
         alertColor: null,
         alertIcon: null,
         alertType: null,
         alertMessage: null,

         newData: [],

         dialogTrigger: false,
         dialogDelete: false,

         targetItem: [],
         revisions: [],
         scrollerHeight: 0,
         isEdit: false,
         isNew: false,
         dialogTitle: '',

         editCategories: [],
         editDataTypes: [],
         selectedCategory: null,
         file: null,
         formYearList: null,

         snackbarText: '',
         snackbar: false,
         snackbarColor: '',
      }
   },
   // !SECTION
   
   computed: {
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
      }
   },

   // SECTION - Watch
   watch: {
      closeDialog (val) {
         val || this.closeDialog()
      },

      dialogDelete(val) {
         val || this.closeDelete()
      },

      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.onTriggeredAlert()
            }, 5000)
         }
      },
   },
   // !SECTION
   
   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })
   },

   methods: {
      onTriggeredAlert() {
         this.alertTrigger = false
         this.alertColor = null
         this.alertIcon = null
         this.alertType = null
         this.alertMessage = null
         this.targetItem = []
         document.getElementById('alertMessage').innerHTML = this.alertMessage
      },

      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId)
      },

      getColor(status) {
         if (status === 1) return "grey lighten-4"
         if (status === 2) return "green darken-1 white--text"
         if (status === 3) return "deep-orange darken-1 white--text"
         if (status === 4) return "cyan lighten-1 white--text"
      },

      async downloadFile(item) {
         const fileExtension = this.getFileExtension(item.path)
         const filename = item.school.name + '_' + item.category + '_' + item.data_type.name + '_' + item.year + fileExtension

         try {
            await this.$axios({
               url: `/downloadFile`,
               method: "POST",
               responseType: 'blob',
               data: {
                  path: item.path
               }
            })
            .then((resp) => {
               const url = window.URL.createObjectURL(new Blob([resp.data]))
               const link = document.createElement('a')
               link.href = url
               link.setAttribute('download', filename)
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)
               this.snackbarText = 'File berhasil diunduh.'
               this.snackbarColor = 'green darken-3'
               this.snackbar = true
            })
         } catch (e) {
            this.snackbarText = 'File tidak ditemukan.'
            this.snackbarColor = 'red darken-2'
            this.snackbar = true
         }
      },

      async dialog(type, item) {
         this.dialogTrigger = true
         if (type === 'edit') {
            this.isEdit = true
            this.dialogTitle = 'Sunting Data'
         } else {
            this.isNew = true
            this.dialogTitle = 'Input Data Baru'
         }

         this.formYearList = this.formYearList ?? this.getFormYearList()
         await this.$axios.get('/getCategories').then((resp) => {
               this.editCategories = resp.data.data
            })

         if (this.isEdit) {            
            this.targetItem = {
               id: item.id,
               data_type_id: item.data_type_id,
               data_type: item.data_type,
               data_status_id: item.data_status_id,
               school_id: item.school_id,
               file: null,
               old_path: item.path,
               path: '',
               year: item.year,
            }
            this.getRevisionScrollerHeight()

            await this.$axios.get(`/school/getRevisionData/${this.targetItem.id}`).then((resp) => {
               this.revisions = resp.data.data
            })

            
            const dataTypeCategory = this.targetItem.data_type.data_category_id
            let selectedCategory = []

            this.editCategories.forEach((item) => {
               if (item.id === dataTypeCategory) {
                  selectedCategory = item
               }
            })

            // await this.$axios.get(`/getDataTypes/${selectedCategory.slug}`).then((resp) => {
            //    this.editDataTypes = resp.data.data
            // })

            await this.$axios.get(`/getDataTypes`, {
               params: {
                  slug: selectedCategory.slug
               }
            }).then((resp) => {
               this.editDataTypes = resp.data.data
            })

            this.selectedCategory = selectedCategory
            this.$refs.editForm.resetValidation()
         }

         if (this.isNew) {
            this.targetItem = {
               data_type_id: 0,
               data_status_id: 1,
               school_id: this.$auth.user.id,
               file: null,
               path: '',
               year: ''
            }
            this.$refs.newForm.resetValidation()
         }
      },

      closeDialog() {
         this.targetItem = []
         this.dialogTrigger = false
         if (this.isEdit) {
            this.revisions = []
            this.scrollerHeight = 0
            this.isEdit = false
            this.$refs.editForm.resetValidation()
         }
         else if (this.isNew) {
            this.isNew = false
            this.$refs.newForm.resetValidation()
         }
      },

      async getDataTypes(categoryId) {
         let selectedCategory = null
         this.editCategories.forEach((item) => {
            if (item.id === categoryId) {
               selectedCategory = item
            }
         })

         // await this.$axios.get(`/getDataTypes/${selectedCategory.slug}`).then((resp) => {
         //    this.editDataTypes = resp.data.data
         // })

         await this.$axios.get(`/getDataTypes`, {
            params: {
               slug: selectedCategory.slug
            }
         }).then((resp) => {
            this.editDataTypes = resp.data.data
         })
         this.targetItem.data_type_id = 0
         this.selectedCategory = selectedCategory
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
      
      async newSubmit() {
         if (this.$refs.newForm.validate()) {
            const filePath = this.generateRandomString(40)
            const fileExtension = this.getFileExtension(this.targetItem.file.name)
            this.targetItem.file = await this.renameFile(this.targetItem.file, filePath, fileExtension, {type: this.targetItem.file.type})
   
            this.targetItem.path = this.targetItem.file.name
   
            const formData = new FormData()
            for (const item in this.targetItem) {
               formData.append(`${item}`, this.targetItem[item])
            }
            // console.log("/**/newSubmit ~ formData:", formData)
            await this.$axios.post(`/data/create`, formData).then((resp) => {
               this.newData = resp.data.data
            })
            this.dialogTrigger = false
            this.isNew = false
            this.dataHandler()
            // this.createAlert = true
            // this.createTimer = 100
            this.alertTrigger = true
            this.alertColor = 'green darken-1'
            this.alertIcon = 'mdi-information-outline'
            this.alertType = 'info'
            this.alertMessage = `Data baru berhasil dibuat. ID data: <code>${this.newData.id}</code>`
            document.getElementById('alertMessage').innerHTML = this.alertMessage
         }
      },

      async editSubmit() {
         if (this.$refs.editForm.validate()) {
            const filePath = this.generateRandomString(40)
            const fileExtension = this.getFileExtension(this.targetItem.file.name)
            this.targetItem.file = await this.renameFile(this.targetItem.file, filePath, fileExtension, {type: this.targetItem.file.type})
   
            this.targetItem.path = this.targetItem.file.name
   
            const formData = new FormData()
            for (const item in this.targetItem) {
               formData.append(`${item}`, this.targetItem[item])
               formData.append('_method', 'PUT')
            }
   
            await this.$axios.post(`/school/data/${this.targetItem.id}/update`, formData)
            this.dialogTrigger = false
            this.isEdit = false
            this.dataHandler()
            // this.editAlert = true
            // this.editTimer = 100
            this.alertTrigger = true
            this.alertColor = 'light-blue darken-1'
            this.alertIcon = 'mdi-information-outline'
            this.alertType = 'info'
            this.alertMessage = `Data <code>${this.targetItem.id}</code> berhasil disunting`
            document.getElementById('alertMessage').innerHTML = this.alertMessage
         }
      },

      deleteItem(item) {
         this.dialogDelete = true
         this.targetItem = Object.assign({}, item)
      },

      async confirmDelete(item) {
         await this.$axios.delete(`/data/${item.id}/delete`, {data: item})
         // this.targetItem = []
         this.dialogDelete = false
         this.dataHandler()
         this.targetItem = []
         this.alertTrigger = true
         this.alertColor = 'red darken-2'
         this.alertIcon = 'mdi-alert-outline'
         this.alertType = 'warning'
         this.alertMessage = `Data <code>${item.id}</code> berhasil dihapus`
         document.getElementById('alertMessage').innerHTML = this.alertMessage
      },

      closeDelete() {
         this.targetItem = []
         this.dialogDelete = false
      },

      getFormYearList() {
         const today = new Date()
         const years = []
         
         if (today.getMonth()+1 < 5) {
            let i = -3
            while (i < 1) {
               years.push((new Date().getFullYear() + i) + '-' + (new Date().getFullYear() + ++i))
            }
         } else {
            let i = -2
            while (i < 2) {
               years.push((new Date().getFullYear() + i) + '-' + (new Date().getFullYear() + ++i))
            }
         }
         return years.reverse()
      },

      getRevisionScrollerHeight() {
         const formHeight = document.getElementById('editForm').offsetHeight
         const textHeight = document.getElementById('revisionText').offsetHeight
         this.scrollerHeight = formHeight - textHeight - 24 /* col padding */ - 16 /* text margin */
         document.getElementById('scrollerContainer').setAttribute('style', `max-height: ${this.scrollerHeight}px!important`)
      }
   }
}
</script>

<style>
.v-pagination__navigation {
   transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.v-pagination__navigation, .v-pagination__item {
   box-shadow: none!important;
}

.v-pagination__navigation:hover, .v-pagination__item:hover:not(.v-pagination__item--active) {
   background-color: #eeeeee!important;
}
</style>
