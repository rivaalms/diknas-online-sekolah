<template>
  <v-app class="v-app">
    <v-navigation-drawer
      v-if="isAuth"
      clipped
      app
    >
      <v-list dense nav>
        <v-list-item-group active-class="primary--text">
          <template v-for="(item, i) in items">
            <template v-if="item.child">
                <v-list-group
                  :key="item.title"
                  :append-icon="submenuIcon"
                >
                  <template #activator>
                    <!-- <v-list-item> -->
                      <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.title }}
                          </v-list-item-title>
                        </v-list-item-content>
                    <!-- </v-list-item> -->
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

          <v-list-item
          to="/students"
          router
          exact
          >
            <v-list-item-icon>
              <v-icon>mdi-account-school</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Data Statistik Siswa</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
          to="/teachers"
          router
          exact
          >
            <v-list-item-icon>
              <v-icon>mdi-human-male-board</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Data Statistik Guru</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar
      v-if="isAuth"
      app
      outlined
      flat
      dark
      clipped-left
      class="app-bar"
    >
      <!-- <v-list dense class="pa-0" color="transparent">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">diknas-online-sekolah</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
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
                <v-list-item-title>{{ $auth.user.name ?? '' }}</v-list-item-title>
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
    
    <v-main id="main">
      <Nuxt/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      user: {name: ''},
      
      items: [
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
      ],
      categories: [],
      submenuIcon: 'mdi-chevron-down'
    }
  },

  computed: {
    ...mapState(['isAuth']),

  },

  watch: {
    isAuth() {
      if (this.isAuth) {
        this.fetchCategories()
        this.user = this.$auth.user
      }
    }
  },
  
  mounted() {
    if (this.isAuth) {
      this.fetchCategories()
      this.user = this.$auth.user
    }
  }, 

  methods: {
    ...mapMutations(['SET_IS_AUTH']),

    async logout() {
        await this.$auth.logout()
        this.SET_IS_AUTH(false)
        this.$router.push('/login')
    },
    
    async fetchCategories() {
      await this.$axios.get('/getCategories').then((response) => {
        const categories = []
        response.data.data.forEach(function(item) {
          categories.push({
            title: item.name,
            to: item.slug
          })
        })
  
        this.items.forEach(function(item) {
          if (item.title === "Kategori") {
            item.child = categories
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}

.v-app {
  background-color: #f5f5f5;
}

.router-active {
  background-color: #2e455b;
  color: white;
  caret-color: #2e455b;
}

.flex-basis-0 {
  flex-basis: 0%;
}

.app-bar {
  background-color: #448AFF!important;
}

/* .v-toolbar__content {
  border-bottom: 1px solid black;
} */

/* .theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled), .v-list-item:not(.v-list-item--active) .v-list-item__content, .v-list-item:not(.v-list-item--active) .v-list-item__icon .v-icon {
  color: #3964ae!important;
} */

/* .active-class {
  background-color: #3964ae;
  color: white!important;
} */
</style>