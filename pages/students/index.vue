<template>
   <v-container fluid>
      <div>
         <page-header
            :title="'Data Statistik Siswa'"
         />
         
         <app-alert/>
         
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-text class="d-flex align-center justify-space-between py-0">
                     <v-col cols="6" md="3">
                        <v-autocomplete
                           v-model="year"
                           :items="yearList"
                           hide-details="auto"
                           label="Tahun ajaran"
                           @input="getStudents(year)"
                        ></v-autocomplete>
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

            <v-col v-if="cardLoader" cols="12">
               <v-progress-linear
                  :active="cardLoader"
                  indeterminate
               ></v-progress-linear>
            </v-col>

            <v-col
               v-for="item in totalStudentsByGrade"
               :key="item.grade"
               cols="6" md="3"
            >
               <v-card flat>
                  <v-card-text>
                     <p>{{ (item.grade === 0) ? 'Jumlah Siswa' : 'Kelas ' + item.grade }}</p>
                     <p class="text-h4 font-weight-medium grey--text text--darken-3">{{ item.total }}</p>
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">Data Siswa Berdasarkan Agama</v-card-title>
                  <v-card-text>
                     <students-by-religion-table
                        :headers="tableHeader"
                        :items="students"
                        :loading="tableLoading"
                     />
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>

      <lazy-add-student-dialog
         @submit="submit"
      />
   </v-container>
</template>

<script>
export default {
   data() {
      return {
         students: [],
         totalStudentsByGrade: [],
         yearList: [],
         year: '',
         user: this.$auth.user,
         tableHeader: [
            {text: 'Kelas', value: 'grade'},
            {text: 'Islam', value: 'islam'},
            {text: 'Katolik', value: 'catholic'},
            {text: 'Protestan', value: 'protestant'},
            {text: 'Hindu', value: 'hindu'},
            {text: 'Buddha', value: 'buddha'},
            {text: 'Konghucu', value: 'konghucu'}
         ],

         tableLoading: false,
         cardLoader: false,
         formYearList: null,
      }
   },

   head() {
      return {
         title: 'Data Statistik Siswa'
      }
   },

   async created() {
      await this.onCreated()
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Data Statistik Siswa', disabled: true, href: '/school' }
      ])
   },

   methods: {
      async onCreated() {
         await this.setYearList()
         await this.getStudents(this.year)
      },
      
      async getStudents(year) {
         this.tableLoading = true
         this.cardLoader = true
         await this.$axios.get(`/getStudents`, {
            params: {
               school: this.user.id,
               year,
            }
         }).then((resp) => {
            this.students = resp.data.data.students
            const totalStudents = resp.data.data.total_students

            const totalStudentsByGrade = []
            this.students.forEach((item) => {
               totalStudentsByGrade.push(
                  {grade: item.grade, total: item.total}
               )
            })

            // this.totalStudents = resp.data.data.total_students
            this.totalStudentsByGrade = totalStudentsByGrade
            this.totalStudentsByGrade.unshift(
               {grade: 0, total: totalStudents}
            )
            this.cardLoader = false
            this.tableLoading = false
         })
      },
      
      async setYearList() {
         await this.$axios.get(`/getStudentsYear`, {
            params: {
               school: this.user.id,
            }
         }).then((resp) => {
            const yearList = []
            resp.data.data.forEach((item) => {
               yearList.push(item.year)
            })
            this.yearList = yearList
            this.year = this.yearList[0]
         })
      },

      dialog() {
         this.formYearList = this.formYearList ?? this.getFormYearList()
         this.$store.dispatch('setDialog', {
            title: 'Input  Data Siswa',
            year_list: this.formYearList,
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