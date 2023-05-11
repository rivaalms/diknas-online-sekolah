<template>
  <v-app class="v-app">
    <app-sidebar
      v-if="isAuth"
      :route="route"
    />

    <app-header
      v-if="isAuth"
      :user="$auth.user"
    />
    
    <v-main id="main">
      <Nuxt/>
    </v-main>
    
    <app-footer
      v-if="isAuth"
    />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      route: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
          to: '/',
          child: null,
        },
        {
          icon: 'mdi-bookshelf',
          title: 'Kategori',
          to: 'category',
          child: []
        },
        {
          icon: 'mdi-account-school',
          title: 'Data Statistik Siswa',
          to: '/students',
          child: null,
        },
        {
          icon: 'mdi-human-male-board',
          title: 'Data Statistik Guru',
          to: '/teachers',
          child: null,
        },
      ],
      categories: [],
    }
  },

  computed: {
    ...mapState(['isAuth']),

  },

  watch: {
    isAuth() {
      if (this.isAuth) {
        this.onAuth()
      }
    }
  },
  
  mounted() {
    if (this.isAuth) {
      this.onAuth()
    }
  }, 

  methods: {
    async fetchCategories() {
      await this.$axios.get('/getCategories').then((response) => {
        const categories = []
        response.data.data.forEach(function(item) {
          categories.push({
            title: item.name,
            to: item.slug
          })
        })
  
        this.route.forEach(function(item) {
          if (item.title === "Kategori") {
            item.child = categories
          }
        })
      })
    },

    onAuth() {
      this.fetchCategories()
    }
  }
}
</script>

<style scoped>
.v-app {
  background-color: #f5f5f5;
}
</style>