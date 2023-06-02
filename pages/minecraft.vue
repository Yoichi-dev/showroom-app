<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        Java版、BE版（統合版）両方からアクセスできるマインクラフトサーバー公開中<br />
        ロビーワールドから配信者向けワールド、参加型ワールドに移動できるようになってます
        <br /><br />
        夜中の3時にサーバーの再起動が掛かります
      </v-row>
      <v-row class="mt-15">
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
      </v-row>
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