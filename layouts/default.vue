<template>
  <v-app dark>
    <v-app-bar flat dense app>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} Yoichiro</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "Watch Log",
    };
  },
};
</script>
