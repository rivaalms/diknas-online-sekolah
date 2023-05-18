<template>
<v-app-bar
   app
   outlined
   flat
   light
   clipped-left
   class="app-bar"
>
   <v-toolbar-title class="text-h6">diknas-online-sekolah</v-toolbar-title>
   <v-spacer/>
   <v-menu offset-y>
      <template #activator="{on, attrs}">
         <v-list nav dense class="pa-0" color="transparent">
            <v-list-item
               v-bind="attrs"
               class="d-flex flex-basis-0 flex-shrink-1 flex-grow-0"
               v-on="on"
            >
               <v-list-item-avatar>
                  <v-img
                     src="https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Jasper"
                  ></v-img>
               </v-list-item-avatar>
               <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </template>
      <v-list>
         <v-list-item
            to="/profile"
            router exact
         >
            <v-list-item-title>
               Profil
            </v-list-item-title>
         </v-list-item>

         <v-divider></v-divider>

         <v-list-item
            @click.stop="logout"
         >
            <v-list-item-title class="red--text">Keluar</v-list-item-title>
         </v-list-item>
      </v-list>
   </v-menu>
</v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
   props: {
      user: {
         type: Object,
         default: () => {}
      }
   },

   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async logout() {
         await this.$auth.logout()
         this.SET_IS_AUTH(false)
         this.$router.push('/login')
      },
   }
}
</script>