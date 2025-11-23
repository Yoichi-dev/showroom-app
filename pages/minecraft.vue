<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        <v-col>
          ネットワークの問題で長らく停止していたマインクラフトサーバーの公開を再開します！<br /><br />
          配信コメントをゲーム内のチャットに表示したり、各別ワールドに行き来できたりプラグインなど希望があれば対応します<br />
          また自分のワールドを持ってきたい場合も対応します<br /><br />
          参加型等での利用もOKです（専用ワールドを起動します）<br /><br />
          利用は<a
            :href="`https://www.twitter.com/messages/compose?recipient_id=1278265302921342976&text=マイクラサーバー利用希望%0D%0Aこのまま送信`"
            style="display: contents;" target="_blank">
            こちら
          </a>から
        </v-col>

      </v-row>
      <!-- <v-row class="mt-15">
        <v-col>
          <v-img max-width="500" :src="require('/assets/img/java.png')"></v-img>
        </v-col>
        <v-col>
          <p class="text-h5">Java版</p>
          <p class="mt-5">サーバーアドレス<br />minecraft.showroom-app.com</p>
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col>
          <v-img max-width="500" :src="require('/assets/img/be.jpg')"></v-img>
        </v-col>
        <v-col>
          <p class="text-h5">BE版（統合版）</p>
          <p class="mt-5">サーバーアドレス<br />minecraft.showroom-app.com</p>
          <p class="mt-2">ポート<br />19132（デフォルト）</p>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  name: 'MinecraftPage',
  data: () => ({
    title: 'マインクラフト',
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    // アナライズ
    axios
      .get(
        `/?room_id=${localStorage.room_id}&page=minecraft&uuid=${localStorage.uuid}`
      )
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    openProfile(id) {
      // this.$refs.profile.getUserData(id)
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>