<template>
<v-navigation-drawer
   v-model="drawer"
   clipped
   app
   mobile-breakpoint="960"
>

<v-list dense nav>
   <v-list-item
      v-if="isMobile"
   >
      <v-list-item-title class="text-subtitle-1">diknas-online-sekolah</v-list-item-title>
      <v-list-item-action>
         <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
         </v-btn>
      </v-list-item-action>
   </v-list-item>

   <v-list-item-group active-class="primary--text">
      <template v-for="(item, i) in route">
         <template v-if="item.child">
            <v-list-group
               :key="item.title"
               :append-icon="submenuIcon"
            >
               <template #activator>
                  <v-list-item-icon>
                     <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>
                        {{ item.title }}
                     </v-list-item-title>
                  </v-list-item-content>
               </template>
               <template v-for="(child, j) in item.child">
                  <v-list-item :key="j" :to="{name: 'category-slug', params: {slug: child.to}}" router exact>
                     <v-list-item-icon></v-list-item-icon>
                     <v-list-item-content>
                        <v-list-item-title>{{ child.title }}</v-list-item-title>
                     </v-list-item-content>
                  </v-list-item>
               </template>
            </v-list-group>
         </template>

         <template v-else>
            <v-list-item
               :key="i"
               :to="item.to"
               router exact
            >
               <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
               </v-list-item-icon>
               <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
         </template>
      </template>
      </v-list-item-group>
   </v-list>

</v-navigation-drawer>
</template>

<script>
export default {
   props: {
      route: {
         type: Array,
         default: () => {}
      },
      sidebar: {
         type: Boolean,
         default: false,
      }
   },

   data() {
      return {
         submenuIcon: 'mdi-chevron-down',
         drawer: this.sidebar,
         isMobile: false,
      }
   },

   watch: {
      sidebar() {
         if (this.sidebar === true) {
            this.drawer = this.sidebar
         }
      },
      
      drawer() {
         this.checkIsMobile()
         
         // NOTE - DO NOT REMOVE THE `IF` STATEMENT, ELSE YOU GOT INFINITE LOOP
         if (this.drawer === false || window.innerWidth >= 960) {
            this.$emit('toggle-sidebar')
         }
      },
   },

   mounted() {
      this.checkIsMobile()
   },

   methods: {
      checkIsMobile() {
         if (window.innerWidth >= 960) {
            this.isMobile = false
         } else this.isMobile = true
      }
   }
}
</script>