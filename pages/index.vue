<template>
  <div>
    <v-parallax v-if="roomStatus" height="300" :src="roomStatus.image_s">
      <v-row align="center">
        <v-col cols="3">
          <v-img
            max-height="170"
            max-width="300"
            class="deep-purple lighten-4"
            :src="roomStatus.image_s"
          ></v-img>
        </v-col>
        <v-col cols="9">
          <span class="ma-auto text-h4 font-weight-thin">
            {{ roomStatus.room_name }}
          </span>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container>
      <v-row v-if="infoData.length !== 0">
        <v-col cols="12">
          <v-card>
            <v-subheader>お知らせ</v-subheader>
            <v-list two-line>
              <template v-for="(info, index) in infoData">
                <v-list-item :key="index">
                  <v-list-item-avatar></v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      timeFormat(info.sys.updatedAt)
                    }}</v-list-item-title>
                    <!-- eslint-disable vue/no-v-html -->
                    <v-list-item-subtitle v-html="info.fields.info">
                      <!-- eslint-enable -->
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider
                  v-if="infoData.length - 1 !== index"
                  :key="`divider-${index}`"
                  inset
                ></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="searchDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5">
            ルームが登録されていません
          </v-card-title>
          <v-card-text>
            Watch Logを利用するためにはルームの登録が必要です<br />
            また、本アプリケーションの<span
              class="text-decoration-underline light-blue lighten-5"
              style="white-space: nowrap"
              >メインターゲットは配信者</span
            >になります<br />
            あくまでも<span
              class="text-decoration-underline light-blue lighten-5"
              style="white-space: nowrap"
              >配信補助アプリ</span
            >と言う位置付けです<br /><br />
            こちらはβ版です<br />
            不具合など発生したら教えてくれると嬉しいです<br />
            <span
              class="text-decoration-underline red lighten-5"
              style="white-space: nowrap"
              >β版のURLは秘密</span
            >でお願いします<br />（検索しても出てこない設定にしているため）
            <br /><br />
            <span class="white--text"
              >訳:リソースの無駄なのでリスナーは使うな</span
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              outlined
              text
              @click="$router.push('/search')"
            >
              理解した上で登録
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import client from '~/plugins/contentful'
import constants from '~/constants'

export default {
  name: 'IndexPage',
  beforeRouteLeave(to, from, next) {
    if (this.socket !== null) {
      this.socket.close()
      clearInterval(this.socketPing)
    }
    next()
  },
  async asyncData({ redirect }) {
    if (!localStorage.room_url_key) {
      return { roomStatus: null }
    }

    const status = await axios.get(
      `${constants.url.other.status}/${localStorage.room_url_key}`
    )

    if (status === undefined) {
      redirect('/maintenance')
      return
    }

    if (status.data.is_live) {
      sessionStorage.room_status = JSON.stringify(status.data)
      redirect('/onlive')
      return
    } else {
      sessionStorage.room_status = null
    }

    return { roomStatus: status.data }
  },
  data: () => ({
    title: '',
    searchDialog: false,
    infoData: [],
    socket: null,
    socketPing: null,
  }),
  mounted() {
    if (!localStorage.room_url_key) {
      this.searchDialog = true
      return
    }
    this.srConnect()

    // 利用可能ギフト取得
    axios
      .get(`${constants.url.live.giftList}${this.roomStatus.room_id}`)
      .then((res) => {
        localStorage.use_gifts = JSON.stringify(res.data.normal)
      })
    // お知らせ取得
    client
      .getEntries({
        content_type: 'info',
      })
      .then((res) => {
        this.infoData = res.items
      })
    // ブロックリスト取得
    client
      .getEntries({
        content_type: 'block',
      })
      .then((res) => {
        localStorage.block = JSON.stringify(res.items[0].fields)
      })
    // 制限解除確認
    client
      .getEntries({
        content_type: 'lift',
      })
      .then((res) => {
        const lift = res.items[0].fields
        for (const user of lift.users) {
          if (
            user.room_id === localStorage.room_id &&
            user.room_url_key === localStorage.room_url_key &&
            user.uuid === localStorage.uuid
          ) {
            localStorage.lift = 1
            break
          }
          localStorage.lift = 0
        }
      })
  },
  methods: {
    srConnect() {
      // 接続
      this.socket = new WebSocket(constants.ws)
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send(`SUB\t${this.roomStatus.broadcast_key}`)
      }
      // 疎通確認
      this.socketPing = setInterval(() => {
        this.socket.send('PING\tshowroom')
      }, 60000)
      // エラー発生時
      this.socket.onerror = (e) => {
        this.socket.close()
        clearInterval(this.socketPing)
        // 再接続
        this.srConnect()
      }
      // メッセージ受信
      this.socket.onmessage = (data) => {
        // 死活監視
        if (
          data.data === 'ACK\tshowroom' ||
          data.data === 'Could not decode a text frame as UTF-8.'
        ) {
          return
        }
        // エラー
        if (data.data === 'ERR') {
          this.socket.close()
          clearInterval(this.socketPing)
          // 再接続
          this.srConnect()
        }

        // JSON変換
        const msgJson = JSON.parse(
          data.data.split(`MSG\t${this.roomStatus.broadcast_key}`)[1]
        )

        if (msgJson.t === 104) {
          this.socket.close()
          clearInterval(this.socketPing)
          // 再接続
          location.reload()
        }
      }
    },
    timeFormat(time) {
      return moment(time).format('llll')
    },
  },
}
</script>

<style>
.v-parallax__image {
  -ms-filter: blur(6px) brightness(50%);
  filter: blur(6px) brightness(50%);
}
</style>