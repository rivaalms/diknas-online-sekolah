<template>
   <v-container fluid>
      <div>
         <div class="d-flex justify-space-between align-center mt-5 mb-8">
            <p class="text-h6 mb-0">{{ category.name }}: {{ type.name }}</p>
            <app-breadcrumb/>
         </div>
         
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Data {{ type.name }} {{ $auth.user.name }}
                  </v-card-title>
                  <v-card-text>
                     <data-table
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
                     Tipe Data Kategori {{ category.name }} Lainnya
                  </v-card-title>
                  <v-card-text>
                     <v-row dense>
                        <v-col
                           v-for="item in dataTypes" :key="item.id"
                           cols="6"
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
                           cols="6"
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
         type: [],
         dataTypes: [],
         category: [],
         categories: [],
         data: [],
         loading: true,
      }
   },

   head() {
      return {
         title: this.category && this.type ? `${this.category.name}: ${this.type.name}` : ''
      }
   },

   async mounted() {
      await this.$axios.get('/getCategories').then((resp) => {
         let category = null
         const categories = []
         const slug = this.$route.params.slug

         resp.data.data.forEach(function(item) {
            if (item.slug === slug) {
               category = item
            } else {
               categories.push(item)
            }
         })

         this.category = category
         this.categories = categories
      })

      await this.$axios.get(`/getDataTypes`, {
         params: {
            slug: this.$route.params.slug
         }
      }).then((resp) => {
         const dataTypes = []
         let dataType = null
         const type = this.$route.params.type

         resp.data.data.forEach(function(item) {
            if (item.slug !== type) {
               dataTypes.push(item)
            } else {
               dataType = item
            }
         })

         this.type = dataType
         this.dataTypes = dataTypes
      })

      this.dataHandler()

      this.$store.dispatch('setBreadcrumb', [
            { text: 'Dashboard', disabled: false, href: '/' },
            { text: `${this.category.name}` ?? '', disabled: false, href: `/category/${this.category.slug}` },
            { text: `${this.type.name}` ?? '', disabled: true, href: `/category/${this.category.slug}/${this.type.slug}` }
      ])
   },

   methods: {
      dataHandler(current, statusId) {
         this.loading = true
         this.$axios.get(`/school/getData/${this.$auth.user.id}`, {
            params: {
               page: current,
               status: statusId,
               data_type: this.type.id
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      }
   }
}
</script>

<style>

</style>