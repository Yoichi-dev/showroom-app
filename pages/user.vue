<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        <v-col>
          <p class="text-h5">登録情報</p>
          <p>ルームID：{{ room_id }}</p>
          <p>ルームURL：{{ room_url_key }}</p>
          <p>UUID：{{ uuid }}</p>
          <p v-if="!liftFlg" class="mt-10">
            Watch Logの制限解除申請は<a
              :href="`https://www.twitter.com/messages/compose?recipient_id=1278265302921342976&text=制限解除申請%0D%0Aroom_id:${room_id}%0D%0Aroom_url_key:${room_url_key}%0D%0Aid:${uuid}`"
              target="_blank"
              >こちら</a
            >（配信者のみ）
          </p>
          <p v-else class="mt-10">配信者登録済み（制限解除済み）</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import client from '~/plugins/contentful'

export default {
  name: 'UserPage',
  async asyncData({ redirect }) {
    if (!localStorage.room_url_key) {
      redirect('/')
      return
    }

    let maintenance = []
    await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => (maintenance = res.items[0].fields))
      .catch()

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    return { maintenance }
  },
  data: () => ({
    title: 'ユーザー情報',
    room_id: null,
    room_url_key: null,
    uuid: null,
    liftFlg: false,
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.liftFlg = Number(localStorage.lift)
    this.room_id = localStorage.room_id
    this.room_url_key = localStorage.room_url_key
    this.uuid = localStorage.uuid
  },
}
</script>
