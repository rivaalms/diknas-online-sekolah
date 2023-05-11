<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Dashboard</p>
         <app-breadcrumb/>
      </div>
      <v-row dense>
         <v-col cols="12" md="6">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Jumlah Siswa
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">
                  {{ totalStudents }}
                  <div class="d-flex justify-end">
                     <v-btn text color="primary" to="/students" exact>
                        Lihat detail
                     </v-btn>
                  </div>
               </v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12" md="6">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Jumlah Guru
               </v-card-title>
               <v-card-text class="text-h4 font-weight-medium grey--text text--darken-4">
                  {{ totalTeachers }}
                  <div class="d-flex justify-end">
                     <v-btn text color="primary" to="/teachers" exact>
                        Lihat detail
                     </v-btn>
                  </div>
               </v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Semua Data {{ user.name }}
               </v-card-title>
               <v-card-text>
                  <data-table
                     :headers="tableHeaders"
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
      </v-row>
   </div>
</v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
   name: 'Dashboard',
   
   async asyncData({store}) {
      await store.dispatch('user/getUserData')
   },
   
   data() {
      return {
         tableHeaders: [
            {
               text: 'ID',
               value: 'id'
            },
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
               text: 'Terakhir diperbarui',
               value: 'date'
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions'
            }
         ],
         data: [],
         loading: true,
         totalStudents: 0,
         totalTeachers: 0,
         year: (new Date().getMonth() > 5) ? `${new Date().getFullYear()}-${(new Date().getFullYear()+1)}` : `${(new Date().getFullYear()-1)}-${new Date().getFullYear()}`
         // status: [],
      }
   },

   head() {
      return {
         title: 'Dashboard'
      }
   },

   computed: {
      ...mapState('user', {
         user: state => state.user
      }),
   },
   
   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: true, href: '/' }
      ])
   },
   
   async mounted() {
      await this.$axios.get(`/school/getData/${this.user.id}`).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })
      await this.getStudents(this.year)
      await this.getTeachers(this.year)
   },

   methods: {
      dataHandler(current, statusId) {
         this.loading = true
         this.$axios.get(`/school/getData/${this.user.id}`, {
            params: {
               page: current,
               status: statusId
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },

      async getStudents(year) {
         await this.$axios.get(`/school/getStudents/${this.user.id}?year=${year}`).then((resp) => {
            let studentCountPerGrade = 0
            let totalStudents = 0
            resp.data.data.forEach((item) => {
               studentCountPerGrade = item.islam + item.catholic + item.protestant + item.hindu + item.buddha + item.konghucu
               totalStudents += studentCountPerGrade
            })
            this.totalStudents = totalStudents
         })
      },

      async getTeachers(year) {
         await this.$axios.get(`/school/getTeachers/${this.user.id}?year=${year}`).then((resp) => {
            let totalTeachers = 0
            for (const item in resp.data.data) {
               if (item !== 'school_id' && item !== 'year' && item !== 'id' && item !== 'created_at' && item !== 'updated_at') {
                  totalTeachers += resp.data.data[item]
               }
            }
            this.totalTeachers = totalTeachers
         })
      },
   }

}
</script>