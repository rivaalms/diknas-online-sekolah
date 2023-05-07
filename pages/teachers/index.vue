<template>
<v-container fluid>
   <div class="mb-12">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Data Statistik Guru</p>
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
   

   <v-dialog
      v-model="dialogTrigger"
      persistent
      max-width="900px"
   >
   <v-card>
      <v-card-title>
         Input Data Guru
      </v-card-title>
      <v-form ref="form" lazy-validation @submit.prevent="onSubmit">
         <v-card-text>
            <v-row>
               <v-col cols="6">
                  <v-text-field
                     :value="user.name"
                     label="Nama Sekolah"
                     hint="Hanya baca"
                     persistent-hint
                     readonly
                  ></v-text-field>
               </v-col>
               <v-col cols="6">
                  <v-select
                        v-model="targetItem.year"
                        :items="formYearList"
                        :rules="formSelectRules"
                        label="Tahun Ajaran"
                     ></v-select>
               </v-col>
               <v-col>
                  <v-text-field
                     v-model="targetItem.math"
                     label="Matematika"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.ind_lit"
                     label="Bahasa Indonesia"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.eng_lit"
                     label="Bahasa Inggris"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.science"
                     label="Ilmu Pengetahuan Alam"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.social"
                     label="Ilmu Pengetahuan Sosial"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.civic"
                     label="Pendidikan Kewarganegaraan"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.islam"
                     label="Pendidikan Agama Islam"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.catholic"
                     label="Pendidikan Agama Katolik"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.protestant"
                     label="Pendidikan Agama Protestan"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.hindu"
                     label="Pendidikan Agama Hindu"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.buddha"
                     label="Pendidikan Agama Buddha"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.konghucu"
                     label="Pendidikan Agama Konghucu"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.counseling"
                     label="Bimbingan Konseling"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.sports"
                     label="Pendidikan Jasmani, Olahraga dan Kesehatan"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.art"
                     label="Seni Budaya dan Keterampilan"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="3">
                  <v-text-field
                     v-model="targetItem.entrepreneurship"
                     label="Kewirausahaan"
                     hint="Hanya angka"
                     :rules="rules"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
               </v-col>
               <v-col cols="12" class="d-flex justify-end">
                  <v-btn text class="me-2" @click="closeDialog">Batal</v-btn>
                  <v-btn 
                     depressed color="primary" type="submit"
                     :loading="submitBtnLoading"
                     :disabled="submitBtnLoading"
                  >Simpan</v-btn>
               </v-col>
            </v-row>
         </v-card-text>
      </v-form>
   </v-card>
   </v-dialog>
   
</v-container>
</template>

<script>
import teacherTable from '@/pages/teachers/components/teacherTable'

export default {
   components: {
      teacherTable
   },

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
         dialogTrigger: false,
         submitBtnLoading: false,

         alertType: 'info',
         alertColor: 'light-blue darken-1',
         alertIcon: 'mdi-information',
         alertTrigger: false,
         alertMessage: 'Data statistik guru baru berhasil dismpan',

         rules: [val => (val || '').length > 0 || 'Wajib diisi']
      }
   },

   head() {
      return {
         title: 'Data Statistik Guru'
      }
   },

   computed: {
      formSelectRules() {
         const data = [v => !!v || 'Wajib diisi']
         return data
      },

      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Data Statistik Guru', disabled: true, href: '/teachers'}
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
            const formData = new FormData()

            for (const item in this.targetItem) {
               if (item !== 'school_id' && item !== 'year') {
                  this.targetItem[item] = Number(this.targetItem[item])
               }
               formData.append(item, this.targetItem[item])
            }
            formData.append('school_id', this.user.id)

            await this.$axios.post(`/school/teachers`, formData)
            this.closeDialog()
            this.submitBtnLoading = false
            await this.setYearList()
            await this.getTeachers(this.targetItem.year)
            this.alertTrigger = true
            this.resetTargetItem()
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
            year: '',
            math: null,
            ind_lit: null,
            eng_lit: null,
            science: null,
            social: null,
            civic: null,
            islam: null,
            catholic: null,
            protestant: null,
            hindu: null,
            buddha: null,
            konghucu: null,
            counseling: null,
            sports: null,
            art: null,
            entrepreneurship: null,
         }
      }
   }
}
</script>