<template>
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
</template>

<script>
import { mapState } from 'vuex'
export default {
   computed: {
      ...mapState(['breadcrumb'])
   },
}
</script>