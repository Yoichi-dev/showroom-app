<template>
  <v-app>
    <v-app-bar flat dense fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      Ver.{{ version }}
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import pkg from '~/package.json'

export default {
  name: 'OnliveLayout',
  data() {
    return {
      title: 'Watch Log',
      version: pkg.version,
    }
  },
}
</script>
