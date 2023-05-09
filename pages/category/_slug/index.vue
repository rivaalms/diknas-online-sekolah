<template>
   <v-container fluid>
      <div class="mb-12">
         <div class="d-flex justify-space-between align-center mt-5 mb-8">
            <p class="text-h6 mb-0">{{ category.name }}</p>
            <v-breadcrumbs
               :items="breadcrumb"
               class="px-0 py-2"
            >
               <template #item="{item}">
                  <v-breadcrumbs-item
                     exact
                     :to="item.href"
                     :disabled="item.disabled"
                  >{{ item.text }}</v-breadcrumbs-item>
               </template>
            </v-breadcrumbs>
         </div>
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Semua Data {{ category.name }} {{ $auth.user.name }}
                  </v-card-title>
                  <v-card-text>
                     <data-table
                        :headers="headers"
                        :items="data.data"
                        :total-page="data.last_page"
                        :current-page="data.current_page"
                        :loading="loading"
                        :from="data.from"
                        :to="data.to"
                        :total="data.total"
                        @data-handler="(current, status_id) => dataHandler(current, status_id)"
                     ></data-table>
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Tipe Data Kategori {{ category.name }}
                  </v-card-title>
                  <v-card-text>
                     <v-row dense>
                        <v-col
                           v-for="item in dataTypes" :key="item.id"
                           cols="12"
                           sm="4"
                           md="2"
                        >
                           <v-card flat outlined class="v-btn text-capitalize" router :to="{name: 'category-slug-type', params: { slug: category.slug, type: item.slug }}" exact>
                              <v-card-text>
                                 {{ item.name }}
                              </v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Kategori Lainnya
                  </v-card-title>
                  <v-card-text>
                     <v-row dense>
                        <v-col
                           v-for="item in categories" :key="item.id"
                           cols="12"
                           sm="4"
                           md="2"
                        >
                           <v-card flat outlined class="v-btn text-capitalize" router :to="{name: 'category-slug', params: {slug: item.slug}}" exact>
                              <v-card-text>
                                 {{ item.name }}
                              </v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>
   </v-container>
</template>

<script>
export default {
   data() {
      return {
         dataTypes: [],
         category: [],
         categories: [],
         headers: [
            {
               text: 'Tipe data',
               value: 'type'
            },
            {
               text: 'Kategori',
               sortable: false,
               value: 'category'
            },
            {
               text: 'Tahun ajaran',
               value: 'year'
            },
            {
               text: 'Status',
               sortable: false,
               value: 'status'
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions'
            }
         ],
         data: [],
         loading: true,
      }
   },

   head() {
      return {
         title: this.category ? this.category.name : ''
      }
   },

   computed: {
      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: `${this.category.name}` ?? '', disabled: true, href: `/category/${this.category.slug}`}
         ]
         return data
      }
   },

   async mounted() {
      await this.$axios.get(`/getDataTypes`, {
         params: {
            slug: this.$route.params.slug
         }
      }).then((resp) => { this.dataTypes = resp.data.data })

      await this.$axios.get(`/getCategories`).then((resp) => {
         let category = null
         const categories = []
         const slug = this.$route.params.slug

         resp.data.data.forEach(function(item, index) {
            if (item.slug === slug) {
               category = item
            } else {
               categories.push(item)
            }
         })

         this.category = category
         this.categories = categories
      })

      this.dataHandler()
   },

   methods: {
      dataHandler(current, statusId) {
         this.loading = true
         this.$axios.get(`/school/getData/${this.$auth.user.id}`, {
            params: {
               page: current,
               status: statusId,
               category: this.category.id
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      }
   }
}
</script>