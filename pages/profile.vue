<template>
  <v-container fluid>
    <div>
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
        <p class="text-h6 mb-0">Profil Akun</p>
        <app-breadcrumb/>
      </div>

      <v-row dense class="align-stretch">
        <v-col cols="12" md="8">
          <v-card flat height="100%">
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6" class="d-flex">
                  <!-- <v-avatar tile size="96" class="me-8">
                    <v-img
                      src="https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Jasper"
                    ></v-img>
                  </v-avatar> -->
                  <div class="flex-grow-1">
                    <p class="text-h6 mb-0">{{ user.name }}</p>
                    <p class="text-subtitle-2 blue--text">{{ user.email }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row dense>
                    <v-col cols="6">
                      <p class="text-subtitle-2 mb-0">Kepala Sekolah</p>
                      <p class="text-body-2">{{ user.principal }}</p>
                    </v-col>
                    <v-col cols="6">
                      <p class="text-subtitle-2 mb-0">Pengawas</p>
                      <p class="text-body-2">{{ supervisor.name }}</p>
                    </v-col>
                    <v-col>
                      <p class="text-subtitle-2 mb-0">Alamat Sekolah</p>
                      <p class="text-body-2">{{ user.address }}</p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat height="100%">
            <v-card-title class="text-subtitle-1">
              Pengaturan Akun
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item link @click="dialog('edit')">
                  <v-list-item-content>
                    <v-list-item-title>Sunting Data Akun</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="dialog('password')">
                  <v-list-item-content>
                    <v-list-item-title>Ubah Kata Sandi</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item link @click.stop="logout">
                  <v-list-item-content>
                    <v-list-item-title class="red--text">Keluar</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="dialogTrigger"
      persistent
      max-width="800"
    >
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <v-form  v-if="isEdit && !isPassword" @submit.prevent="submit()">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Nama Sekolah"
                  hint="Hanya baca"
                  persistent-hint
                  :value="targetItem.name"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Alamat Email"
                  hint="Hanya baca"
                  persistent-hint
                  :value="targetItem.email"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="targetItem.principal"
                  label="Kepala Sekolah"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="targetItem.address"
                  rows="2"
                  no-resize
                  label="Alamat"
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn class="me-2" depressed @click="closeDialog()">Batal</v-btn>
                <v-btn color="primary" depressed class="me-2" type="submit">Simpan</v-btn>
              </v-col>
            </v-row>
          </v-form>
          
          <v-alert
            :type="passwordAlertType"
            dismissible
            text
            transition="fade-transition"
            :value="passwordAlertTrigger"
          >
            {{ passwordAlertMessage }}
          </v-alert>
          <v-form v-if="isPassword && !isEdit" ref="passwordForm" autocomplete="off" lazy-validation @submit.prevent="passwordSubmit()">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="targetItem.old_password"
                  :append-icon="passwordShow.old_password ? 'mdi-eye' : 'mdi-eye-off'"
                  label="Kata Sandi Saat Ini"
                  :type="passwordShow.old_password ? 'text' : 'password'"
                  counter="true"
                  :rules="passwordRules"
                  @click:append="passwordShow.old_password = !passwordShow.old_password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="targetItem.password"
                  :append-icon="passwordShow.password ? 'mdi-eye' : 'mdi-eye-off'"
                  label="Kata Sandi Baru"
                  :type="passwordShow.password ? 'text' : 'password'"
                  counter="true"
                  :rules="passwordRules"
                  @click:append="passwordShow.password = !passwordShow.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="targetItem.confirm_password"
                  :append-icon="passwordShow.confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passwordShow.confirm_password ? 'text' : 'password'"
                  counter="true"
                  label="Konfirmasi Kata Sandi Baru"
                  :rules="passwordMatchRules"
                  @click:append="passwordShow.confirm_password = !passwordShow.confirm_password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn class="me-2" depressed @click="closeDialog()">Batal</v-btn>
                <v-btn color="primary" depressed class="me-2" type="submit">Simpan</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      user: [],
      supervisor: [],
      dialogTrigger: false,
      targetItem: [],
      passwordShow: [],
      
      isPassword: false,
      isEdit: false,
      dialogTitle: null,

      alertType: null,
      alertColor: null,
      alertIcon: null,
      alertMessage: null,
      alertTrigger: false,

      passwordAlertTrigger: false,
      passwordAlertColor: '',
      passwordAlertMessage: '',
      passwordAlertType: 'error',
    }
  },

  head() {
      return {
        title: 'Profil'
      }
  },

  computed: {
    ...mapState(['isAuth']),

    passwordRules() {
      const data = [
        val => {
          if (!val || val.length === 0) return 'Wajib diisi'
          else if (val.length < 8) return 'Minimal 8 karakter'
          else return true
        }
      ]
      return data
    },

    passwordMatchRules() {
      const data = [
        val => {
          if (!val || val.length === 0) return 'Wajib diisi'
          else if (val !== this.targetItem.password) return 'Kata sandi tidak sama'
          else return true
        }
      ]
      return data
    }
    
  },

  watch: {
    alertTrigger() {
      if (this.alertTrigger === true) {
        setTimeout(() => {
          this.onTriggeredAlert()
        }, 5000)
      }
    },

    passwordAlertTrigger() {
      if (this.passwordAlertTrigger === true) {
        setTimeout(() => {
          this.onTriggeredPasswordAlert()
        }, 5000)
      }
    }
  },

  async mounted() {
    await this.getSelf()
    
    this.$store.dispatch('setBreadcrumb', [
        { text: 'Dashboard', disabled: false, href: '/' },
        { text: 'Profil Akun', disabled: true, href: '/profile' }
    ])
  },

  methods: {
    ...mapMutations(['SET_IS_AUTH']),

    async getSelf() {
      await this.$axios.get('/school/getSelf').then((response) => {
        this.user = response.data.data
        this.supervisor = response.data.data.supervisor
      })
    },

    async logout() {
      await this.$auth.logout()
      this.SET_IS_AUTH(false)
      this.$router.push('/login')
    },

    async dialog(type) {
      this.dialogTrigger = true
      
      if (type === 'edit') {
        this.isEdit = true
        this.dialogTitle = 'Sunting Data Akun'

        this.targetItem = {
          // id: this.user.id,
          name: this.user.name,
          email: this.user.email,
          school_type_id: this.user.school_type_id,
          supervisor_id: this.user.supervisor_id,
          principal: this.user.principal,
          address: this.user.address
        }
      }
      
      if (type === 'password') {
        this.isPassword = true
        this.dialogTitle = 'Ubah Kata Sandi'
        this.targetItem = {
          old_password: '',
          password: '',
          confirm_password: '',
        }
        this.passwordShow = {
          old_password: false,
          password: false,
          confirm_password: false,
        }
        await this.wait(50)
        this.$refs.passwordForm.resetValidation()
      }
    },

    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    closeDialog() {
      if (this.isPassword) {
        this.$refs.passwordForm.resetValidation()
        this.isPassword = false
      } else if (this.isEdit) {
        this.isEdit = false
      }
      this.dialogTrigger = false
      this.targetItem = []
    },

    async submit() {
      await this.$axios.put(`/school/update/${this.user.id}`, this.targetItem).then((resp) => {
        this.dialogTrigger = false

        this.alertType = 'info'
        this.alertIcon = 'mdi-information'
        this.alertColor = 'cyan'
        this.alertMessage = `Data akun berhasil disuting`
        document.getElementById('alertMessage').innerHTML = this.alertMessage
        this.alertTrigger = true
        this.getSelf()
        this.targetItem = []
      })
    },

    async passwordSubmit() {
      if (this.$refs.passwordForm.validate()) {
        try {
          await this.$axios.put(`/school/updatepassword/${this.user.id}`, this.targetItem).then((resp) => {
            this.closeDialog()
            this.alertColor = 'cyan'
            this.alertIcon = 'mdi-information'
            this.alertMessage = 'Kata sandi berhasil diubah'
            this.alertType = 'info'
            document.getElementById('alertMessage').innerHTML = this.alertMessage
            this.alertTrigger = true
          })
        } catch (e) {
          this.passwordAlertType = 'error'
          this.passwordAlertMessage = e.response.data.message
          this.passwordAlertColor = 'red'
          this.passwordAlertTrigger = true
          this.$refs.passwordForm.reset()
        }
      }
    },

    onTriggeredPasswordAlert() {
      this.passwordAlertType = null
        this.passwordAlertMessage = null
        this.passwordAlertColor = null
        this.passwordAlertTrigger = false
    },

    onTriggeredAlert() {
        this.alertTrigger = false
        this.alertColor = null
        this.alertIcon = null
        this.alertType = null
        this.alertMessage = null
        document.getElementById('alertMessage').innerHTML = this.alertMessage
    },
  }
}
</script>

<style scoped>
.card-text {
  width: auto;
  flex-shrink: 0;
}
</style>