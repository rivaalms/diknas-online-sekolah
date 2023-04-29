<template>
   <v-container fluid>
      <div class="mb-12">
         <div class="d-flex justify-space-between align-center mt-5 mb-8">
            <p class="text-h6 mb-0">Data Statistik Siswa</p>
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

         <v-alert
            :type="alertType"
            :color="alertColor"
            :icon="alertIcon"
            dismissible
            text
            transition="fade-transition"
            :value="alertTrigger"
            >
               {{ alertMessage }}
            </v-alert>
         
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-text class="d-flex align-center justify-space-between py-0">
                     <v-col cols="6" md="2">
                        <v-select
                           v-model="year"
                           :items="yearList"
                           label="Tahun ajaran"
                           hide-details
                           @input="getStudents(year)"
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
                     <p class="text-h4 font-weight-medium grey--text text--darken-4">{{ item.total }}</p>
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">Data Siswa Berdasarkan Agama</v-card-title>
                  <v-card-text>
                     <religion-table
                        :headers="tableHeader"
                        :items="students"
                        :loading="tableLoading"
                     />
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>

      <v-dialog
         v-model="dialogTrigger"
         persistent
         max-width="800px"
      >
         <v-card>
            <v-card-title>
               Input Data Siswa
            </v-card-title>
            <v-form ref="form" lazy-validation @submit.prevent="onSubmit">
               <v-card-text>
                  <v-row>
                     <v-col cols="12" md="4">
                        <v-text-field
                           :value="user.name"
                           label="Nama Sekolah"
                           hint="Hanya baca"
                           persistent-hint
                           readonly
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-select
                           v-model="targetItem.grade"
                           :items="formGradeList"
                           required
                           label="Kelas"
                        ></v-select>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-select
                           v-model="targetItem.year"
                           :items="formYearList"
                           :rules="formSelectRules"
                           label="Tahun Ajaran"
                     ></v-select>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.islam"
                           label="Siswa Agama Islam"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.catholic"
                           label="Siswa Agama Katolik"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.protestant"
                           label="Siswa Agama Protestan"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.hindu"
                           label="Siswa Agama Hindu"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.buddha"
                           label="Siswa Agama Buddha"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" md="4">
                        <v-text-field
                           v-model="targetItem.konghucu"
                           label="Siswa Agama Konghucu"
                           hint="Masukan hanya angka"
                           :rules="rules"
                           @keypress="numberOnly"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12" class="d-flex justify-end">
                        <v-btn text class="me-2" @click="closeDialog">Batal</v-btn>
                        <v-btn type="submit" color="primary" depressed :loading="submitBtnLoading" :disabled="submitBtnLoading">Simpan</v-btn>
                     </v-col>
                  </v-row>
               </v-card-text>
            </v-form>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script>
import ReligionTable from '@/pages/students/components/studentsByReligionTable'
export default {
   components: {
      ReligionTable,
   },

   data() {
      return {
         students: [],
         // totalStudents: 0,
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
         dialogTrigger: false,
         targetItem: [],
         formYearList: null,
         submitBtnLoading: false,

         alertType: 'info',
         alertColor: 'light-blue darken-1',
         alertIcon: 'mdi-information',
         alertTrigger: false,
         alertMessage: 'Data statistik siswa baru berhasil dismpan',
      }
   },

   computed: {
      formGradeList() {
         const data = (this.user.school_type_id === 1) ? [7, 8, 9] : [1, 2, 3, 4, 5, 6]
         return data
      },

      rules() {
         const data = [val => (val || '').length > 0 || 'Wajib diisi']
         return data
      },

      formSelectRules() {
         const data = [v => !!v || 'Wajib diisi']
         return data
      },

      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Data Statistik Siswa', disabled: true, href: '/school'}
         ]
         return data
      }
   },

   watch: {
      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.alertTrigger = false
            }, 5000)
         }
      },
   },

   async created() {
      await this.onCreated()
   },

   mounted() {

   },

   methods: {
      async onCreated() {
         await this.setYearList()
         await this.getStudents(this.year)
      },
      
      async getStudents(year) {
         this.tableLoading = true
         this.cardLoader = true
         await this.$axios.get(`/school/getStudents/${this.user.id}?year=${year}`).then((resp) => {
            this.students = resp.data.data
            let studentCountPerGrade = 0
            let totalStudents = 0
            const totalStudentsByGrade = []
            this.students.forEach((item) => {
               studentCountPerGrade = item.islam + item.catholic + item.protestant + item.hindu + item.buddha + item.konghucu

               totalStudentsByGrade.push(
                  {grade: item.grade, total: studentCountPerGrade}
               )

               totalStudents += studentCountPerGrade
            })

            // this.totalStudents = totalStudents
            this.totalStudentsByGrade = totalStudentsByGrade
            this.totalStudentsByGrade.unshift(
               {grade: 0, total: totalStudents}
            )
            this.cardLoader = false
            this.tableLoading = false
         })
      },
      
      async setYearList() {
         await this.$axios.get(`/school/getStudentsYear/${this.user.id}`).then((resp) => {
            const yearList = []
            resp.data.data.forEach((item) => {
               yearList.push(item.year)
            })
            this.yearList = yearList
            this.year = this.yearList[0]
         })
      },

      dialog() {
         this.dialogTrigger = true
         this.formYearList = this.formYearList ?? this.getFormYearList()
         this.resetTargetItem()
      },

      closeDialog() {
         this.$refs.form.resetValidation()
         this.resetTargetItem()
         this.dialogTrigger = false
      },

      async onSubmit() {
         if (this.$refs.form.validate()) {
            this.submitBtnLoading = true
            for (const item in this.targetItem) {
               if (item !== 'school_id' && item !== 'grade' && item !== 'year') {
                  this.targetItem[item] = Number(this.targetItem[item])
               }
            }
            // console.log(this.targetItem)
            await this.$axios.post(`/school/students`, this.targetItem)
   
            this.closeDialog()
            this.submitBtnLoading = false
            this.alertTrigger = true
            await this.getStudents(this.year)
         }
      },

      numberOnly() {
         const e = window.event
         const expect = e.target.value.toString() + e.key.toString();
         if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
            e.preventDefault();
         } else {
            return true;
         }
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

      resetTargetItem() {
         this.targetItem = {
            school_id: this.user.id,
            grade: this.formGradeList[0],
            year: null,
            islam: null,
            catholic: null,
            protestant: null,
            hindu: null,
            buddha: null,
            konghucu: null,
         }
      }
   }
}
</script>