<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in menu" :key="i" :to="item.to" router exact
          @click="$nuxt.$emit('updateGenre', item.id)">
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense clipped-left fixed flat app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer app :absolute="!fixed">
      <span>&copy; {{ new Date().getFullYear() }} {{ author }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: null,
      fixed: false,
      inset: true,
      menu: [],
      title: 'ShowTube β版',
      author: 'T.Yoichiro',
    }
  },
  created() {
    this.setListener()
  },
  mounted() {
    if (this.menu.length === 0 && localStorage.menu) {
      this.menu = JSON.parse(localStorage.menu)
    }
  },
  methods: {
    setListener() {
      this.$nuxt.$on('updateMenu', this.setMenu)
    },
    setMenu(menu) {
      this.menu = menu
      localStorage.menu = JSON.stringify(menu)
    }
  }
}
</script>
