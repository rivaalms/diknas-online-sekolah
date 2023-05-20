<template>
<v-dialog
   v-model="dialogNewTrigger"
   persistent
   max-width="800px"
>
   <v-card>
      <v-card-title>
         {{ dialog ? dialog.title : '' }}
      </v-card-title>
      <v-form ref="form" lazy-validation @submit.prevent="submit">
         <v-card-text>
            <v-row>
               <v-col cols="12" md="4">
                  <v-text-field
                     :value="$auth.user.name"
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
                     :rules="formSelectRules"
                     label="Kelas"
                  ></v-select>
               </v-col>
               <v-col cols="12" md="4">
                  <v-select
                     v-model="targetItem.year"
                     :items="dialog ? dialog.year_list : []"
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
</template>

<script>
import {mapState} from 'vuex'
export default {
   data() {
      return {
         targetItem: {},
         submitBtnLoading: false,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogNewTrigger']),

      formGradeList() {
         const data = (this.$auth.user.school_type_id === 1) ? [7, 8, 9] : [1, 2, 3, 4, 5, 6]
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
   },

   watch: {
      async dialogNewTrigger() {
         if (this.dialogTrigger) {
            this.targetItem = {
            grade: this.dialog ? this.dialog.year_list[0] : null,
            year: null,
            islam: null,
            catholic: null,
            protestant: null,
            hindu: null,
            buddha: null,
            konghucu: null,
            }
         }
         await this.wait(50)
         this.$refs.form.resetValidation()
      }
   },

   methods: {
      async submit() {
         this.targetItem.school_id = this.$auth.user.id
         if (this.$refs.form.validate()) {
            this.submitBtnLoading = true
            for (const item in this.targetItem) {
               if (item !== 'school_id' && item !== 'grade' && item !== 'year') {
                  this.targetItem[item] = Number(this.targetItem[item])
               }
            }
            await this.$axios.post(`/storeStudents`, this.targetItem).then(resp => {
               this.$store.dispatch('setAlert', {
                  type: 'info',
                  icon: 'mdi-information',
                  message: 'Data statistik siswa baru berhasil dismpan'
               })
               this.$emit('submit')
            }).catch(e => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  icon: 'mdi-alert-outline',
                  message: e
               })
            }).finally(() => {
               this.closeDialog()
               this.submitBtnLoading = false
               this.$store.dispatch('showAlert')
            })
         }
      },

      closeDialog() {
         this.$store.dispatch('closeDialog')
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

      wait(ms) {
         return new Promise(resolve => setTimeout(resolve, ms))
      },
   }
}
</script>