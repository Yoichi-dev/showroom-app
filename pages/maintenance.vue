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
    const maintenance = await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => res.items[0].fields)
      .catch((e) => {
        console.log(e)
      })

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
