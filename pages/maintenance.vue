<template>
  <v-row>
    <v-col class="text-center">
      <blockquote class="blockquote">{{ maintenance.message.msg }}</blockquote>
    </v-col>
  </v-row>
</template>

<script>
import client from '~/plugins/contentful'

export default {
  name: 'MaintenancePage',
  async asyncData({ redirect }) {
    let maintenance = []
    await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => (maintenance = res.items[0].fields))
      .catch()

    if (!maintenance.flg) {
      redirect('/')
      return
    }
    return { maintenance }
  },
  data: () => ({
    title: 'メンテナンス',
  }),
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
