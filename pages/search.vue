<template>
  <div>
    <v-container class="mt-10">
      <v-row>
        <v-text-field
          class="mx-3"
          label="検索"
          color="green"
          placeholder="ルーム名を入力してEnterで検索"
          prepend-inner-icon="mdi-magnify"
          outlined
          @keypress.enter="searchRoom"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-col>
          <p class="red--text">{{ error }}</p>
          <span>ルーム名を入力して検索してください</span><br />
          <span>
            <a href="https://www.showroom-live.com/room/search" target="_blank">
              SHOWROOMの検索
            </a>
            で検索できない事は検索できません
          </span>
          <br />
          <span>また、負荷分散の為検索結果は上位10件のみ表示されます</span>
        </v-col>
      </v-row>
      <v-divider v-if="!searchFlg" class="my-10"></v-divider>
      <v-progress-linear
        v-if="searchFlg"
        class="my-10"
        indeterminate
        color="green"
      ></v-progress-linear>
      <v-row>
        <v-col
          v-for="(item, index) in searchList"
          :key="index"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 16 : 2"
              class="mx-auto"
              :class="{ 'on-hover': hover }"
              @click="registerCheck(item)"
            >
              <v-img class="white--text align-end" :src="item.img"> </v-img>
              <v-card-text class="text--primary">
                <div>{{ item.title }}</div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          {{ room.title }}
        </v-card-title>
        <v-card-text> このルームを登録しますか？ </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="register()"> 登録 </v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import UUID from 'uuidjs'
import constants from '~/constants'
import client from '~/plugins/contentful'
import pkg from '~/package.json'

export default {
  name: 'SearchPage',
  layout: 'onlive',
  async asyncData() {
    let block = []
    await client
      .getEntries({
        content_type: 'block',
      })
      .then((res) => (block = res.items))
      .catch()
    return { block }
  },
  data: () => ({
    title: 'ルーム検索',
    error: '',
    room: {
      img: '',
      id: '',
      url: '',
      title: '',
    },
    dialog: false,
    searchFlg: false,
    searchList: [],
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    localStorage.block = JSON.stringify(this.block[0].fields)
    if (localStorage.room_id || localStorage.room_url_key) {
      this.$router.push('/')
    }
  },
  methods: {
    searchRoom(val) {
      this.error = ''
      this.searchList = []

      if (val.target.value.length === 0) {
        this.error = 'ルーム名を入力してください'
        return
      }

      const keyword = val.target.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

      this.searchFlg = true

      axios
        .get(`${constants.url.other.search}${keyword}`)
        .then((response) => {
          if (response.data.length === 0) {
            this.error = '検索結果がありません。条件を変えて検索してください'
          } else {
            this.searchList = response.data
          }
        })
        .catch((e) => {
          alert('エラーが発生しました')
        })
        .finally(() => {
          this.searchFlg = false
        })
    },
    registerCheck(room) {
      this.error = ''
      if (this.block[0].fields.roomId.includes(room.id)) {
        this.error = 'このルームは登録できません'
        return
      }

      this.dialog = true
      this.room = room
    },
    register() {
      this.dialog = false
      localStorage.room_url_key = this.room.url
      localStorage.room_id = this.room.id

      if (localStorage.uuid === undefined || localStorage.uuid === null) {
        localStorage.uuid = UUID.generate()
      }

      localStorage.version = pkg.version
      localStorage.lift = 0

      this.$router.push('/')
    },
  },
}
</script>
