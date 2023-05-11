<template>
<v-dialog
   v-model="dialogNewTrigger"
   persistent
   max-width="900px"
>
<v-card>
   <v-card-title>
      {{ dialog ? dialog.title : '' }}
   </v-card-title>
   <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card-text>
         <v-row>
            <v-col cols="6">
               <v-text-field
                  :value="$auth.user.name"
                  label="Nama Sekolah"
                  hint="Hanya baca"
                  persistent-hint
                  readonly
               ></v-text-field>
            </v-col>
            <v-col cols="6">
               <v-select
                     v-model="targetItem.year"
                     :items="dialog ? dialog.year_list : []"
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
</template>

<script>
import { mapState } from 'vuex'
export default {
   data() {
      return {
         targetItem: {},
         submitBtnLoading: false,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogNewTrigger']),

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
         await this.wait(50)
         this.$refs.form.resetValidation()
      }
   },

   methods: {
      async submit() {
         this.targetItem.school_id = this.$auth.user.id
         if (this.$refs.form.validate()) {
            this.submitBtnLoading = true
            const formData = new FormData()

            for (const item in this.targetItem) {
               if (item !== 'school_id' && item !== 'year') {
                  this.targetItem[item] = Number(this.targetItem[item])
               }
               formData.append(item, this.targetItem[item])
            }
            // formData.append('school_id', this.user.id)

            await this.$axios.post(`/school/teachers`, formData).then((resp) => {
               this.$store.dispatch('setAlert', {
                  type: 'info',
                  color: 'light-blue darken-1',
                  icon: 'mdi-information',
                  message: 'Data statistik guru baru berhasil disimpan',
               })
               this.$emit('submit')
            }).catch(e => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  color: 'red darken-2',
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
         this.targetItem = {}
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