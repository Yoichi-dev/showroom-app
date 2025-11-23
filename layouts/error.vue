<template>
  <v-app dark>
    <h3 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h3>
    <h3 v-else>
      {{ otherError }}
    </h3>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'ページが存在しません',
      otherError: 'エラーが発生しました',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>
