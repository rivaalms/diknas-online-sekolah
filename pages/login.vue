<template>
<v-container>
   <v-row class="justify-center">
      <v-col cols="6">
         <v-card class="mx-auto mt-12">
      
            <!-- Login Form -->
            <v-form @submit.prevent="onSubmit">
      
            <!-- Email Input -->
            <v-text-field
               v-model="email"
               :rules="emailRules"
               label="Email"
               required
            ></v-text-field>
      
            <!-- Password Input -->
            <v-text-field
               v-model="password"
               
               label="Password"
               type="password"
               required
            ></v-text-field>
      
            <!-- Login Button -->
            <v-btn type="submit" color="primary" class="mt-5">Login</v-btn>
      
            </v-form>
      
         </v-card>
      </v-col>
   </v-row>
</v-container>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
   auth: 'guest',

   data() {
      return {
         email: '',
         password: '',
         emailRules: [
         v => !!v || 'Email is required',
         v => /.+@.+\..+/.test(v) || 'Email must be valid',
         ],
      }
   },

   mounted() {
      this.ifLoggedIn()
   },
   
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async onSubmit() {
         await this.$auth.loginWith('local', {
            data: {
               email: this.email,
               password: this.password
            }
         }).then((resp) => {
            this.SET_IS_AUTH(true)
            this.$router.push('/')
         }).catch((error) => { return error })
      },

      ifLoggedIn() {
         if (this.$auth.loggedIn) {
            this.$router.push('/')
         }
      },
   },

}
</script>