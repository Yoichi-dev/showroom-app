<template>
  <v-row>
    <v-col class="text-center mt-10">
      <blockquote class="blockquote">アクセスが集中しています</blockquote>
      <blockquote class="blockquote">
        しばらくしてから<span class="font-weight-black"> ホーム </span
        >にアクセスしてください
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>
import client from '~/plugins/contentful'

export default {
  name: 'ForbiddenPage',
  async asyncData({ redirect }) {
    const maintenance = await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => res.items[0].fields)

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    return { maintenance }
  },
  data: () => ({
    title: 'アクセス過多',
  }),
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
