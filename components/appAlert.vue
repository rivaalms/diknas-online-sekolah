<template>
<v-alert
   :type="alert.type"
   :icon="alert.icon"
   dismissible
   prominent
   border="left"
   transition="fade-transition"
   :value="alertTrigger"
>
   <span id="alertMessage"></span>
</v-alert>
</template>

<script>
import { mapState } from 'vuex'
export default {
   computed: {
      ...mapState(['alert', 'alertTrigger'])
   },

   watch: {
      alertTrigger() {
         if (this.alertTrigger) {
            if (this.alert.message) {
               document.getElementById('alertMessage').innerHTML = this.alert.message
            }
            setTimeout(() => {
               this.$store.dispatch('clearAlert')
            }, 5000)
         }
      }
   },
}
</script>