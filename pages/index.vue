<template>
  <div>
    <v-container>
      <v-row class="mt-10">
        β版の提供は終了しました、
        <a href="https://watch-log.showroom-app.com/" target="_blank">
          正式版
        </a>
        をご利用ください
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    title: 'ホーム',
  }),
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
