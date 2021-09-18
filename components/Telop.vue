<template>
  <v-row v-if="telop != null">
    <v-col cols="12">
      <v-alert
        class="ma-0"
        color="cyan"
        border="left"
        elevation="1"
        colored-border
      >
        {{ telop }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["telop"],
};
</script>
