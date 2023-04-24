<template>
  <div>
    <v-parallax v-if="roomStatus && $vuetify.breakpoint.name !== 'xs'" height="300" :src="roomStatus.image_s
        .replace('_s.png', '_l.png')
        .replace('_s.jpeg', '_l.jpeg')
      ">
      <v-row align="center">
        <v-col cols="3">
          <v-img max-height="170" max-width="300" class="deep-purple lighten-4" :src="roomStatus.image_s
              .replace('_s.png', '_l.png')
              .replace('_s.jpeg', '_l.jpeg')
            "></v-img>
        </v-col>
        <v-col cols="9">
          <span class="ma-auto text-h4 font-weight-thin">
            {{ roomStatus.room_name }}
          </span>
        </v-col>
      </v-row>
    </v-parallax>
    <v-card v-if="roomStatus && $vuetify.breakpoint.name === 'xs'">
      <v-img class="white--text align-end" height="200px" :src="roomStatus.image_s
          .replace('_s.png', '_l.png')
          .replace('_s.jpeg', '_l.jpeg')
        ">
        <v-card-title class="top-img">{{ roomStatus.room_name }}</v-card-title>
      </v-img>
    </v-card>

    <v-container>
      <v-row v-if="uuid && !roomStatus" justify="center">
        <v-alert class="mt-5" outlined type="error" text>
          ルームが削除されている可能性があります<br />
          <nuxt-link :to="`/search?u=${uuid}`"> こちら </nuxt-link>
          から再登録してください
        </v-alert>
      </v-row>
      <v-row v-if="pointHistoryFlg" justify="center">
        <v-alert class="mt-5" outlined type="success" text>
          連携サイト、Point Historyで参加イベントの集計をしています<br />
          <a :href="`https://point-history.showroom-app.com/event/${eventData.event_id}`"
            target="_blank">https://point-history.showroom-app.com/event/{{
              eventData.event_id
            }}</a>
        </v-alert>
      </v-row>
      <v-row v-if="eventData">
        <v-col cols="12" sm="4">
          <v-img :src="eventData.image
                .replace('_s.png', '_l.png')
                .replace('_s.jpeg', '_l.jpeg')
              "></v-img>
        </v-col>
        <v-col cols="12" sm="8">
          <v-simple-table>
            <thead>
              <tr>
                <th colspan="2" class="text-left">
                  {{ eventData.event_name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>開始日時</td>
                <td>{{ timeFormat(eventData.started_at * 1000) }}</td>
              </tr>
              <tr>
                <td>終了日時</td>
                <td>{{ timeFormat(eventData.ended_at * 1000) }}</td>
              </tr>
              <tr v-if="eventData.ranking !== undefined">
                <td>現在のポイント（順位）</td>
                <td>
                  {{ $numberFormat(eventData.ranking.point) }}pt（{{
                    eventData.ranking.rank
                  }}位）
                </td>
              </tr>
              <tr v-else-if="eventData.quest !== undefined">
                <td>現在のポイント（Lv）</td>
                <td>
                  {{
                    $numberFormat(eventData.quest.support.current_point)
                  }}pt（Lv{{ eventData.quest.quest_level }}）
                </td>
              </tr>
              <tr v-else>
                <td>現在の合計ポイント</td>
                <td>
                  {{ $numberFormat(eventData.additional_event_point_sum) }}pt
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>

      <v-row v-if="minecraft" class="mt-5" justify="center">
        <v-alert icon="mdi-minecraft" prominent text type="info">
          配信者向けマインクラフトサーバーβ版公開中！<br />
          詳細は<nuxt-link to="/minecraft"> こちら </nuxt-link>
        </v-alert>
      </v-row>

      <v-row v-if="infoData.length !== 0">
        <v-col cols="12">
          <v-card class="mb-10">
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

                <v-divider v-if="infoData.length - 1 !== index" :key="`divider-${index}`" inset></v-divider>
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
            また、本アプリケーションの<span class="text-decoration-underline light-blue lighten-5"
              style="white-space: nowrap">メインターゲットは配信者</span>になります<br />
            あくまでも<span class="text-decoration-underline light-blue lighten-5"
              style="white-space: nowrap">配信補助アプリ</span>と言う位置付けです<br /><br />
            このアプリケーションは<span class="text-decoration-underline light-blue lighten-5"
              style="white-space: nowrap">SHOWROOMとは関係ない個人で作ってるもの</span>になります<br />
            運用は開発者の裁量です<br />
            <span class="white--text">訳:リソースの無駄なのでリスナーは使うな</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" outlined text @click="$router.push('/search')">
              理解した上で登録
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '~/plugins/axios'
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

    const maintenance = await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => res.items[0].fields)

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    const status = await axios
      .post(constants.url.showroom_api, {
        category: 'room',
        type: 'status',
        key: localStorage.room_url_key,
      })
      .then((res) => res.data)
      .catch((e) => e.message)

    if (typeof status === 'string' && status.includes('403')) {
      redirect('/forbidden')
      return
    }

    if ('errors' in status) {
      if ('redirect_url' in status.errors[0]) {
        sessionStorage.premium = true
        redirect('/premium')
        return
      } else {
        return { roomStatus: null }
      }
    }

    if (status.is_live) {
      sessionStorage.room_status = JSON.stringify(status)
      redirect('/onlive')
      return
    } else {
      sessionStorage.removeItem('room_status')
    }

    return { roomStatus: status }
  },
  data: () => ({
    title: 'ホーム',
    searchDialog: false,
    infoData: [],
    socket: null,
    socketPing: null,
    roomProfile: null,
    eventData: null,
    pointHistoryFlg: false,
    uuid: null,
    checkFlg: false,
    minecraft: false,
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    if (!localStorage.room_url_key) {
      this.searchDialog = true
      return
    }

    this.uuid = localStorage.uuid

    if (!this.roomStatus) {
      return
    }

    // 登録日付
    if (!localStorage.register) {
      localStorage.register = Math.floor(new Date().getTime() / 1000)
    }

    this.srConnect()

    // 利用可能ギフト取得
    axios
      .post(constants.url.showroom_api, {
        category: 'live',
        type: 'gift_list',
        key: localStorage.room_id,
      })
      .then((res) => {
        if (!('errors' in res.data)) {
          localStorage.use_gifts = JSON.stringify(res.data.normal)
        }
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
        limit: 300,
      })
      .then((res) => {
        const lift = res.items[0].fields
        localStorage.lift = 0
        for (const user of lift.users) {
          if (
            user.room_id === localStorage.room_id &&
            user.room_url_key === localStorage.room_url_key &&
            user.uuid === localStorage.uuid
          ) {
            localStorage.lift = 1
            break
          }
        }
      })

    // 解除判定
    if (
      localStorage.lift === '1' ||
      Number(localStorage.register) >
      Math.floor(new Date().getTime() / 1000) - 259200
    ) {
      this.checkFlg = true
    }

    // 特別情報
    if (localStorage.lift === '1') {
      client
        .getEntries({
          content_type: 'special',
        })
        .then((res) => {
          const uuidlist = res.items[0].fields.uuid
          for (const uuid of uuidlist.uuid) {
            if (uuid === localStorage.uuid) {
              this.minecraft = true
              break
            }
          }
        })
    }

    if (this.checkFlg) {
      ; (async () => {
        // ルーム情報取得
        await axios
          .post(constants.url.showroom_api, {
            category: 'room',
            type: 'profile',
            key: localStorage.room_id,
          })
          .then((res) => {
            this.roomProfile = res.data
          })
        if (this.roomProfile !== null) {
          await axios
            .post(constants.url.showroom_api, {
              category: 'room',
              type: 'event_and_support',
              key: localStorage.room_id,
            })
            .then((res) => {
              this.eventData = res.data.event
            })
          if (this.eventData) {
            await axios
              .post(constants.url.pointhistory_api, {
                event_id: this.eventData.event_id,
                room_id: localStorage.room_id,
              })
              .then((res) => {
                this.pointHistoryFlg = res.data
              })
          }
        }
      })()
    }
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
          localStorage.removeItem('room_status')
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

.top-img {
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
}
</style>