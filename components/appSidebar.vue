<template>
<v-navigation-drawer
   clipped
   app
>
<v-list dense nav>
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
   },

   data() {
      return {
         submenuIcon: 'mdi-chevron-down'
      }
   }
}
</script>