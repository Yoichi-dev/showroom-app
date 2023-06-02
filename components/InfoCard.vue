<template>
  <v-card class="mx-auto" shaped outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline">
          <slot>info</slot>
        </div>
        <v-list-item-title class="text-h5">
          {{ infoCardData.main }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ infoCardData.sub }} </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar tile size="50">
        <v-icon size="50">{{ infoCardData.icon }}</v-icon>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'CardMolecule',
  props: {
    infoCardData: {
      type: Object,
      required: true,
    },
  },
}
</script>
