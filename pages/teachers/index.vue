<template>
<v-container fluid>
   <div>
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Data Statistik Guru</p>
         <app-breadcrumb/>
      </div>

      <app-alert/>

      <v-row dense>
         <v-col cpls="12">
            <v-card flat>
               <v-card-text class="d-flex align-center py-0 justify-space-between">
                  <v-col cols="6" md="2">
                     <v-select
                        v-model="year"
                        :items="yearList"
                        label="Tahun ajaran"
                        hide-details
                        @input="getTeachers(year)"
                     ></v-select>
                  </v-col>
                  <v-btn
                     depressed
                     color="primary"
                     class="align-self-center"
                     @click="dialog()"
                  >Input Data</v-btn>
               </v-card-text>
            </v-card>
         </v-col>

         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">Data Jumlah Guru</v-card-title>
               <v-card-text>
                  <teacher-table
                     :headers="tableHeaders"
                     :items="teachers"
                     :loading="tableLoading"
                  />
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>
   
   <lazy-add-teacher-dialog
      @submit="submit"
   />
   
</v-container>
</template>

<script>
export default {
   data() {
      return {
         user: this.$auth.user,
         year: '',
         yearList: [],
         teachers: [],

         tableHeaders: [
            {text: 'Mata Pelajaran', value: 'subject'},
            {text: 'Jumlah', value: 'value'}
         ],

         targetItem: [],
         formYearList: null,
         
         tableLoading: false,
         cardLoader: false,
      }
   },

   head() {
      return {
         title: 'Data Statistik Guru'
      }
   },

   async created() {
      await this.onCreated()

      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Data Statistik Guru', disabled: true, href: '/teachers' }
      ])
   },

   methods: {
      async onCreated() {
         await this.setYearList()
         await this.getTeachers(this.year)
      },

      async setYearList() {
         await this.$axios.get(`/school/getTeachersYear/${this.user.id}`).then((resp) => {
            const yearList = []
            resp.data.data.forEach((item) => {
               yearList.push(item.year)
            })
            this.yearList = yearList
            this.year = this.yearList[0]
         })
      },

      async getTeachers(year) {
         this.tableLoading = true
         this.cardLoader = true
         this.teachers = []
         await this.$axios.get(`/school/getTeachers/${this.user.id}?year=${year}`).then((resp) => {
            let totalTeachers = 0
            for (const item in resp.data.data) {
               if (item !== 'school_id' && item !== 'year' && item !== 'id' && item !== 'created_at' && item !== 'updated_at') {
                  totalTeachers += resp.data.data[item]
                  this.teachers.push({ subject: item, value: resp.data.data[item] })
               }
            }
            this.teachers.unshift({subject: 'total', value: totalTeachers})
         })
         this.tableLoading = false
         this.cardLoader = false
      },

      dialog() {
         this.formYearList = this.formYearList ?? this.getFormYearList()
         // this.resetTargetItem()
         this.$store.dispatch('setDialog', {
            title: 'Input Data Guru',
            year_list: this.formYearList
         })
         this.$store.dispatch('showNewDialog')
      },
      
      async submit() {
         await this.onCreated()
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
   }
}
</script>