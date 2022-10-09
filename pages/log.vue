<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        <v-col>
          <p class="text-h5">配信ログ</p>
          <p v-if="logList.length === 0" class="mt-15">ログが存在しません</p>
          <v-simple-table v-else class="mt-5">
            <tbody>
              <tr v-for="(log, index) in logList" :key="index">
                <td class="pr-0" style="width: 10px">
                  <v-btn
                    class="ma-2"
                    outlined
                    fab
                    color="pink lighten-3"
                    x-small
                    @click="favorite(log.log_id)"
                  >
                    <v-icon v-if="favoriteLog.includes(log.log_id)"
                      >mdi-cards-heart</v-icon
                    >
                    <v-icon v-else>mdi-cards-heart-outline</v-icon>
                  </v-btn>
                </td>
                <td>{{ timeFormat(log.log_id) }}のログ</td>
                <td class="text-right">
                  <v-btn
                    class="ma-2"
                    outlined
                    color="indigo"
                    @click="$router.push('/history?id=' + log.log_id)"
                  >
                    確認
                  </v-btn>
                  <v-btn
                    class="ma-2"
                    outlined
                    color="red"
                    :disabled="favoriteLog.includes(log.log_id)"
                    @click="deleteLog(log.log_id)"
                  >
                    削除
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> 削除しますか？ </v-card-title>
        <v-card-text> 削除したら二度と復元できません </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDb()"> 削除 </v-btn>
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
import moment from 'moment'
import constants from '~/constants'

export default {
  name: 'LogPage',
  data: () => ({
    room_id: null,
    room_url_key: null,
    uuid: null,
    favoriteLog: [],
    logList: [],
    dialog: false,
    deleteId: null,
  }),
  mounted() {
    axios
      .post(constants.url.watchlog.getloglist, {
        uuid: localStorage.uuid,
      })
      .then((res) => {
        this.logList = res.data
      })
    this.room_id = localStorage.room_id
    this.room_url_key = localStorage.room_url_key
    this.uuid = localStorage.uuid
    if (localStorage.favorite_log) {
      this.favoriteLog = localStorage.favorite_log
    }
  },
  methods: {
    timeFormat(time) {
      return moment(time * 1000).format('llll')
    },
    deleteLog(logId) {
      this.deleteId = logId
      this.dialog = true
    },
    deleteDb() {
      ;(async () => {
        await axios.post(constants.url.watchlog.delete, {
          uuid: localStorage.uuid,
          log_id: this.deleteId,
        })
        await axios
          .post(constants.url.watchlog.getloglist, {
            uuid: localStorage.uuid,
          })
          .then((res) => {
            this.logList = res.data
          })
        this.deleteId = null
        this.dialog = false
      })()
    },
    favorite(logId) {
      let favoriteList = []

      if (localStorage.favorite_log) {
        favoriteList = JSON.parse(localStorage.favorite_log)
      }

      if (favoriteList.includes(logId)) {
        favoriteList = favoriteList.filter((id) => id !== logId)
      } else {
        favoriteList.push(logId)
      }

      this.favoriteLog = favoriteList

      localStorage.favorite_log = JSON.stringify(favoriteList)
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>