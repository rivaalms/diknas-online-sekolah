<!-- eslint-disable vue/no-mutating-props  -->
<template>
<div>
   <app-alert/>

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
         @click.stop="dialog('new')"
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
                  @click="dialog('delete', item)"
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

   <lazy-delete-data-dialog
      @delete="dataHandler()"
   />
   <lazy-create-data-dialog
      @submit="dataHandler()"
   />
   <lazy-edit-data-dialog
      @submit="dataHandler()"
   />

   <lazy-app-snackbar/>
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
   
   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         statusId: null,
         status: [],

         targetItem: {},
         revisions: [],

         editCategories: [],
         editDataTypes: [],
         selectedCategory: null,
         formYearList: null,
      }
   },

   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })
      await this.$store.dispatch('onMountedPage')
   },

   methods: {
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
               this.$store.dispatch('setSnackbar', {
                  color: 'green darken-3',
                  message: 'File berhasil diunduh.'
               })
               this.$store.dispatch('showSnackbar')
            })
         } catch (e) {
            this.$store.dispatch('setSnackbar', {
               color: 'red darken-2',
               message: 'File tidak ditemukan.'
            })
            this.$store.dispatch('showSnackbar')
         }
      },

      async dialog(type, item) {
         this.formYearList = this.formYearList ?? this.getFormYearList()
         await this.$axios.get('/getCategories').then((resp) => {
               this.editCategories = resp.data.data
            })

         let title = '' 
         if (type === 'edit') {
         this.$store.dispatch('showEditDialog')
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

            title = 'Sunting Data'

            await this.$axios.get(`/school/getRevisionData/${this.targetItem.id}`).then((resp) => {
               this.revisions = resp.data.data
            })

            this.$store.dispatch('setRevision', this.revisions ?? null)

            const dataTypeCategory = this.targetItem.data_type.data_category_id
            let selectedCategory = []

            this.editCategories.forEach((item) => {
               if (item.id === dataTypeCategory) {
                  selectedCategory = item
               }
            })

            await this.$axios.get(`/getDataTypes`, {
               params: {
                  slug: selectedCategory.slug
               }
            }).then((resp) => {
               this.editDataTypes = resp.data.data
            })

            this.selectedCategory = selectedCategory

            this.$store.dispatch('setFormUtils', {
               year_list: this.formYearList,
               edit_categories: this.editCategories,
               selected_category: this.selectedCategory ?? null,
               data_types: this.editDataTypes,
               status: this.status,
            })

         }
         else if (type === 'new') {
            await this.$store.dispatch('showNewDialog')
            this.targetItem = {
               data_type_id: 0,
               data_status_id: 1,
               school_id: this.$auth.user.id,
               file: null,
               path: '',
               year: ''
            }
            title = 'Input Data Baru'

            this.$store.dispatch('setFormUtils', {
               year_list: this.formYearList,
               categories: this.editCategories,
               status: this.status,
            })
         }
         else if (type === 'delete') {
            await this.$store.dispatch('showDeleteDialog')
            this.targetItem = item
            title = 'Hapus Data?'
         }

         this.$store.dispatch('setDialog', {
            type,
            title,
         })

         this.$store.dispatch('setData', this.targetItem)
      },

      deleteItem(item) {
         this.dialogDelete = true
         this.targetItem = Object.assign({}, item)
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

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

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
