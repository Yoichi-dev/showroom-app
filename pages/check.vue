<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <p>{{ errorMsg }}</p>
          <v-btn
            v-if="error"
            class="ma-2"
            outlined
            color="indigo"
            @click="getGiftList"
          >
            再取得
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import client from '~/plugins/contentful'
import constants from '~/constants'

export default {
  name: 'CheckPage',
  async asyncData({ redirect }) {
    if (!localStorage.room_url_key) {
      return { roomStatus: null }
    }

    const maintenance = await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => res.items[0].fields)
      .catch((e) => {
        console.log(e)
      })

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    return { maintenance }
  },
  data: () => ({
    title: 'チェック',
    error: false,
    errorMsg: '',
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    if (!localStorage.room_id) {
      this.error = true
      this.errorMsg = 'ルームIDが登録されていません'
      return
    }

    if (!localStorage.room_url_key) {
      this.error = true
      this.errorMsg = 'ルームURLが登録されていません'
      return
    }

    if (!localStorage.uuid) {
      this.error = true
      this.errorMsg = 'UUIDが登録されていません'
      return
    }

    if (!localStorage.lift) {
      this.error = true
      this.errorMsg = '解除判定情報が登録されていません'
      return
    }

    if (!localStorage.version) {
      this.error = true
      this.errorMsg = 'バージョン情報が登録されていません'
      return
    }

    if (!localStorage.block) {
      this.error = true
      this.errorMsg = 'ブロック情報が登録されていません'
      return
    }

    if (!localStorage.use_gifts) {
      this.error = true
      this.errorMsg = 'ギフト情報が登録されていません'
      return
    }

    this.errorMsg = 'エラーはありません'
  },
  methods: {
    getGiftList() {
      // 利用可能ギフト取得
      axios
        .post(constants.url.showroom_api, {
          category: 'live',
          type: 'gift_list',
          key: localStorage.room_id,
        })
        .then((res) => {
          localStorage.use_gifts = JSON.stringify(res.data.normal)
          location.reload()
        })
    },
  },
}
</script>
