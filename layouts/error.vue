<template>
  <v-app dark>
    <div>
      <Info />
    </div>
    <h1>
      {{ this.error.statusCode === 404 ? this.pageNotFound : this.otherError }}
    </h1>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "登録されているイベント情報がありません",
      otherError: "システムエラーが発生しました",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
