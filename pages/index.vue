<template>
  <main class="uk-container uk-margin-top">
    <div uk-grid>
      <div class="uk-width-auto@s">
        <span v-if="profileImgFlg" uk-spinner="ratio: 4.5"></span>
        <img
          :data-src="roomData.image"
          class="pointer"
          alt=""
          uk-img
          @click="openUrl(roomData.share_url)"
        />
      </div>
      <div class="uk-width-expand@s">
        <table class="uk-table uk-table-divider">
          <caption>
            {{
              roomData.room_name
            }}
          </caption>
          <tbody>
            <tr>
              <td>フォロワー</td>
              <td>{{ formatNum(roomData.follower_num) }}人</td>
            </tr>
            <tr>
              <td>ルームレベル</td>
              <td>{{ roomData.room_level }}</td>
            </tr>
            <tr>
              <td>ランク</td>
              <td>{{ roomData.show_rank_subdivided }}</td>
            </tr>
            <tr>
              <td colspan="2">
                <button
                  class="uk-button uk-button-danger"
                  type="button"
                  @click="dataFormat()"
                >
                  初期化
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />
    <div v-if="eventData != null" uk-grid>
      <div class="uk-width-auto@s">
        <span
          v-if="eventImgFlg"
          class="uk-margin-small-right"
          uk-spinner="ratio: 3"
        ></span>
        <img
          class="pointer"
          :data-src="roomData.event.image"
          alt=""
          uk-img
          @click="openUrl(eventData.event.event_url)"
        />
      </div>
      <div class="uk-width-expand@s">
        <table class="uk-table uk-table-divider">
          <caption>
            {{
              roomData.event.name
            }}
          </caption>
          <tbody>
            <tr>
              <td>開始日時</td>
              <td>{{ formatTime(roomData.event.started_at) }}</td>
            </tr>
            <tr>
              <td>終了日時</td>
              <td>{{ formatTime(roomData.event.ended_at) }}</td>
            </tr>
            <tr v-if="eventData.event.ranking !== undefined">
              <td>現在のポイント（順位）</td>
              <td>
                {{ formatNum(eventData.event.ranking.point) }}pt（{{
                  eventData.event.ranking.rank
                }}位）
              </td>
            </tr>
            <tr v-else>
              <td>現在のポイント（Lv）</td>
              <td>
                {{
                  formatNum(eventData.event.quest.support.current_point)
                }}pt（Lv{{ eventData.event.quest.quest_level }}）
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />
    <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
      <div>
        <table class="uk-table uk-table-middle uk-table-divider">
          <caption>
            お知らせ
          </caption>
          <tbody v-if="infos != []">
            <tr v-for="(info, index) in infos" :key="index">
              <!-- eslint-disable vue/no-v-html -->
              <td v-html="info.fields.info"></td>
              <!-- eslint-enable -->
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table class="uk-table uk-table-middle uk-table-divider">
          <tbody v-if="streaminglog != []">
            <tr v-for="(item, index) in streaminglog" :key="index">
              <td style="white-space: nowrap">
                {{ formatTime(item.info.startedAt) }} のログ
              </td>
              <td>
                <button
                  class="uk-button uk-button-primary"
                  type="button"
                  @click="$router.push('/history?id=' + item.id)"
                >
                  表示
                </button>
                <button
                  class="uk-button uk-button-danger"
                  type="button"
                  @click="deleteLog(item.id)"
                >
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import client from '~/plugins/contentful'
import constants from '~/constants'
import pkg from '~/package.json'

export default {
  name: 'IndexPage',
  beforeRouteLeave(to, from, next) {
    this.end()
    next()
  },
  async asyncData() {
    let infos = []
    await client
      .getEntries({
        content_type: 'info',
      })
      .then((res) => (infos = res.items))
      .catch()
    return { infos }
  },
  data() {
    return {
      title: 'HOME',
      api: null,
      socket: null,
      roomId: null,
      url: null,
      broadcastKey: null,
      roomData: [],
      eventData: null,
      streaminglog: [],
      checkPing: null,
      profileImgFlg: true,
      eventImgFlg: true,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  created() {
    setTimeout(() => {
      if (
        this.$store.state.version === null ||
        this.$store.state.version !== pkg.version
      ) {
        this.$store.commit('setVersion', pkg.version)
      }
      if (this.$store.state.apiFlg) {
        this.api = constants.url.main
      } else {
        this.api = constants.url.sub
      }
      if (this.$store.state.roomid === null || this.$store.state.url === null) {
        localStorage.clear()
        this.$router.push('/search')
        return
      } else {
        this.roomId = this.$store.state.roomid
      }
      if (this.$store.state.streaminglog != null) {
        this.streaminglog = this.$store.state.streaminglog
      }
    }, 0)
  },
  mounted() {
    // ソケット接続
    setTimeout(() => {
      if (this.$store.state.url != null) {
        this.url = this.$store.state.url
        this.getApi(`${this.api}${constants.url.other.broadcast}${this.url}`)
          .then((res) => {
            this.broadcastKey = res.data
            if (res.data.split(':').length === 2) {
              this.$router.push('/onlive')
            } else {
              this.connectSocket()
            }
            this.getRoomData()
          })
          .catch((e) => {
            this.getApi(
              `${this.api}${constants.url.room.profile}${this.roomId}`
            )
              .then((res) => {
                if (res.data.premium_room_type === 1) {
                  this.$router.push('/premium')
                }
              })
              .catch((e) => {
                alert('エラーが発生しました\nリロードしてください')
              })
          })
      }
    }, 1000)
  },
  methods: {
    connectSocket() {
      // 接続
      this.socket = new WebSocket(constants.ws)
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send(`SUB\t${this.broadcastKey}`)
      }
      // エラー発生時
      this.socket.onerror = (e) => {
        this.error()
      }
      // 疎通確認
      // this.checkPing = setInterval(() => {
      //   this.socket.send('PING\tshowroom')
      // }, 60000)
      // メッセージ受信
      this.socket.onmessage = (data) => {
        // 死活監視
        if (data.data === 'ACK\tshowroom') {
          return
        }
        // エラー
        if (
          data.data === 'ERR' ||
          data.data === 'Could not decode a text frame as UTF-8.'
        ) {
          return
        }
        // JSON変換
        const getJson = JSON.parse(
          data.data.split(`MSG\t${this.broadcastKey}`)[1]
        )

        if (getJson.t === 104) {
          this.end()
          this.$router.push('/onlive')
        }
      }
      setTimeout(() => {
        this.end()
        location.reload()
      }, 500000)
    },
    error() {
      alert('エラーが発生しました\nページをリロードします')
      this.end()
      location.reload()
    },
    end() {
      if (this.socket != null) {
        this.socket.close()
      }
      // if (this.checkPing != null) {
      //   clearInterval(this.checkPing)
      // }
    },
    getRoomData() {
      // 配信情報取得
      this.getApi(`${this.api}${constants.url.room.profile}${this.roomId}`)
        .then((res) => {
          this.profileImgFlg = false
          this.roomData = res.data
          this.getEventData()
        })
        .catch((e) => {
          alert('エラーが発生しました')
        })
    },
    getEventData() {
      if (this.roomData.event === null) {
        return
      }
      // イベント情報取得
      // TODO:DBにアクセスして登録されていたら集計サイトURL表示
      this.getApi(
        `${this.api}${constants.url.room.eventAndSupport}${this.roomId}`
      )
        .then((res) => {
          this.eventImgFlg = false
          this.eventData = res.data
        })
        .catch((e) => {
          alert('エラーが発生しました')
        })
    },
    getApi(url) {
      return axios.get(url)
    },
    deleteLog(id) {
      const result = confirm('配信ログを削除しますか？')
      if (result) {
        const newLogList = this.streaminglog.filter((ele) => ele.id !== id)
        this.streaminglog = newLogList
        this.$store.commit('setStreaminglog', this.streaminglog)
      }
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
    formatTime(unixTime) {
      return moment(unixTime * 1000).format('llll')
    },
    dataFormat() {
      const result = confirm(
        'ルームデータ・配信ログを全て削除しますか？\n※削除した場合データは元に戻せません'
      )
      if (result) {
        this.getApi(`${this.api}${constants.url.other.delete}`)
        localStorage.clear()
        location.reload()
      }
    },
    formatNum(num) {
      if (num !== undefined) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
  },
}
</script>
