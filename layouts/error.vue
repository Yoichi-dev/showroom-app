<template>
  <v-app dark>
    <Info />
    <h1>申し訳ございません、サーバーが停止です。</h1>
    <h3>
      又は海外からのアクセスを禁止しているのでサーバー側のIP制限でアクセス出来ない人がいます
    </h3>
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
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
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
