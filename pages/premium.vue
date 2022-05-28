<template>
  <main class="uk-margin-top uk-margin-left uk-margin-right">
    <Modal
      id="open"
      uk-toggle="target: #profile"
      :modal="listenerData"
      @addBlock="addBlock"
      @delBlock="delBlock"
    />
    <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
      <Info
        :info="{
          title: '獲得ポイント',
          main: `約 ${formatNum(freePoint + prePoint + countPoint)}pt`,
          sub: `無料 ${formatNum(freePoint)}pt | カウント ${formatNum(
            countPoint
          )}pt`,
          icon: 'star',
        }"
      />

      <Info
        :info="{
          title: 'フォロワー',
          main: `${roomData != null ? formatNum(roomData.follower_num) : 0}人`,
          sub: `開始から ${
            roomData != null
              ? roomData.follower_num >= startFollower
                ? '+' + (roomData.follower_num - startFollower)
                : '-' + (startFollower - roomData.follower_num)
              : 0
          }人`,
          icon: 'heart',
        }"
      />

      <Info
        :info="{
          title: '来場者',
          main: (roomData != null ? formatNum(roomData.view_num) : 0) + '人',
          sub: `1分前から ${
            roomData != null
              ? roomData.view_num >= startView
                ? '+' + (roomData.view_num - startView)
                : '-' + (startView - roomData.view_num)
              : 0
          }人`,
          icon: 'users',
        }"
      />

      <Info
        :info="{
          title: '配信開始時間',
          main:
            roomData != null
              ? formatTime(roomData.current_live_started_at)
              : '停止中',
          sub: `経過時間 ${elapsedTime}`,
          icon: 'clock',
        }"
      />
    </div>

    <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
      <Comment
        :comment="commentList"
        :telop="telop"
        @parentMethod="getListener"
      />
      <div>
        <div>
          <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
            <div>
              <Gift :gift="freeGiftList" @parentMethod="getListener" />
              <Gift :gift="preGiftList" @parentMethod="getListener" />
            </div>
            <div>
              <Count :count="countList" @parentMethod="getListener" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import constants from '~/constants'

export default {
  name: 'OnlivePage',
  // 離脱時
  beforeRouteLeave(to, from, next) {
    if (this.socket != null) {
      this.socket.close()
    }
    next()
  },
  data() {
    return {
      title: 'ONLIVE',
      api: null,
      socket: null,
      roomId: null,
      useGiftList: [],
      rankingList: [],
      countList: [],
      commentList: [],
      preGiftList: [],
      freeGiftList: [],
      roomData: null,
      streamData: null,
      freePoint: 0,
      prePoint: 0,
      countPoint: 0,
      follower: 0,
      startFollower: 0,
      view: 0,
      startView: 0,
      elapsedTime: '',
      premiumFlg: false,
      checkPing: null,
      timer: null,
      telop: '',
      listenerData: {},
      blockUser: [],
      blockKeyword: [],
      streaminglog: [],
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  created() {
    setTimeout(() => {
      if (this.$store.state.apiFlg) {
        this.api = constants.url.main
      } else {
        this.api = constants.url.sub
      }
    }, 0)
  },
  mounted() {
    setTimeout(() => {
      if (this.$store.state.roomid === null) {
        this.$router.push('/search')
      } else {
        this.roomId = this.$store.state.roomid
        // プレミアム配信中かチェック
        this.getApi(`${this.api}${constants.url.room.profile}${this.roomId}`)
          .then((res) => {
            if (res.data.premium_room_type === 1) {
              this.getBcsvrKey()
            } else {
              this.$router.push('/')
            }
          })
          .catch((e) => {
            alert('エラーが発生しました')
            this.$router.push('/')
          })
      }
      if (this.$store.state.streaminglog != null) {
        this.streaminglog = this.$store.state.streaminglog
      }
    }, 0)
  },
  methods: {
    getBcsvrKey() {
      const intervalOnLive = setInterval(() => {
        this.getApi(`${this.api}${constants.url.live.premium}`)
          .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              if (String(res.data[i].room_id) === this.roomId) {
                clearInterval(intervalOnLive)
                this.socketSetting(res.data[i].bcsvr_key)
                this.getInfo()
                break
              }
            }
          })
          .catch((e) => {
            alert('エラーが発生しました')
            clearInterval(intervalOnLive)
            this.$router.push('/')
          })
      }, 1500)
    },
    async getInfo() {
      await this.update()
      // インフォメーション取得
      const infoData = JSON.parse(JSON.stringify(this.roomData))
      this.setTimer(infoData.current_live_started_at)
      this.startFollower = infoData.follower_num
      this.startView = infoData.view_num
    },
    async connectRoom() {
      // 配信情報取得
      const responseLiveData = await this.getApi(
        `${this.api}${constants.url.live.liveInfo}${this.roomId}`
      )
      if (responseLiveData.data.live_status === 2) {
        this.streamData = responseLiveData.data
      } else {
        this.$router.push('/')
        return
      }
      // コメントログを取得
      const befotCommentLogJson = await this.getApi(
        `${this.api}${constants.url.live.commentLog}${this.roomId}`
      )
      for (
        let i = befotCommentLogJson.data.comment_log.length - 1;
        i >= 0;
        i--
      ) {
        this.commentProcess({
          u: befotCommentLogJson.data.comment_log[i].user_id,
          ac: befotCommentLogJson.data.comment_log[i].name,
          cm: befotCommentLogJson.data.comment_log[i].comment,
          ua: befotCommentLogJson.data.comment_log[i].ua,
          av: befotCommentLogJson.data.comment_log[i].avatar_id,
        })
      }
      // ギフトログを取得
      const befotGiftLogJson = await this.getApi(
        `${this.api}${constants.url.live.giftLog}${this.roomId}`
      )
      for (const befotGiftLog of befotGiftLogJson.data.gift_log) {
        this.giftProcess({
          u: befotGiftLog.user_id,
          ac: befotGiftLog.name,
          g: befotGiftLog.gift_id,
          n: befotGiftLog.num,
          ua: befotGiftLog.ua,
          av: befotGiftLog.avatar_id,
        })
      }
      // 接続
      this.socketSetting(responseLiveData.data.bcsvr_key)
      await this.update()
      // インフォメーション取得
      const infoData = JSON.parse(JSON.stringify(this.roomData))
      this.setTimer(infoData.current_live_started_at)
      this.startFollower = infoData.follower_num
      this.startView = infoData.view_num
    },
    getApi(url) {
      return axios.get(url)
    },
    error() {
      alert('エラーが発生しました\nページをリロードします')
      this.end()
    },
    socketSetting(bcsvrKey) {
      // 接続
      this.socket = new WebSocket(constants.ws)
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send(`SUB\t${bcsvrKey}`)
      }
      // エラー発生時
      this.socket.onerror = (e) => {
        this.error()
      }
      // 疎通確認
      this.checkPing = setInterval(() => {
        this.socket.send('PING\tshowroom')
        this.update()
      }, 60000)
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
          this.error()
        }
        // JSON変換
        const getJson = JSON.parse(data.data.split(`MSG\t${bcsvrKey}`)[1])
        // 処理分岐
        if (Object.keys(getJson).length === 10) {
          // コメントログ
          this.commentProcess(getJson)
        } else if (Object.keys(getJson).length === 13) {
          // ギフトログ
          this.giftProcess(getJson)
        } else if (Object.keys(getJson).length === 5) {
          // テロップ
          this.telopProcess(getJson)
        } else if (Object.keys(getJson).length === 7) {
          // 訪問通知
          this.visitProcess(getJson)
        } else if (Object.keys(getJson).length === 4 && getJson.t === 101) {
          this.end()
        }
      }
    },
    commentProcess(commentObj) {
      // 自動投稿空白対策
      if (commentObj.cm === undefined) {
        return
      }
      // ブロック
      if (this.blockCheck(commentObj.u)) {
        return
      }
      // 全角数字を半角に変換
      const numberFormat = commentObj.cm.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      })
      if (!isNaN(numberFormat) && Number(numberFormat) <= 50) {
        // カウント
        this.addCount(commentObj, Number(numberFormat))
      } else {
        // コメント
        this.addComment(commentObj)
      }
    },
    addCount(countObj, formatNumber) {
      // 既に存在するか確認
      if (this.countList.some((e) => e.id === countObj.u)) {
        for (const i in this.countList) {
          if (this.countList[i].id === countObj.u) {
            this.countList[i].num = formatNumber
            this.countList[i].name = countObj.ac
            this.countList[i].avatar = countObj.av
          }
        }
        let countData = null
        for (let i = 0; i < this.countList.length; i++) {
          if (this.countList[i].id === countObj.u) {
            countData = this.countList[i]
            // 削除
            this.countList.splice(i, 1)
            // 先頭に追加
            this.countList.unshift(countData)
          }
        }
      } else {
        // 新規追加
        this.countList.unshift({
          id: countObj.u,
          name: countObj.ac,
          num: formatNumber,
          flg: countObj.ua,
          avatar: countObj.av,
          pointFlg: false,
        })
      }
      // ポイント計算
      this.countPoint = 0
      for (let i = 0; i < this.countList.length; i++) {
        this.countPoint += Number(this.countList[i].num)
      }
    },
    addComment(commentObj) {
      let blockFlg = true
      // ブロックキーワード
      for (let i = 0; i < this.blockKeyword.length; i++) {
        if (commentObj.cm.match(/ + this.blockKeyword[i] + /)) {
          blockFlg = false
        }
      }
      if (blockFlg) {
        this.commentList.unshift({
          id: commentObj.u,
          name: commentObj.ac,
          comment: commentObj.cm,
          flg: commentObj.ua,
          avatar: commentObj.av,
        })
      } else {
        this.commentList.unshift({
          id: commentObj.u,
          name: commentObj.ac,
          comment: 'ブロックキーワードを含むため非表示',
          flg: commentObj.ua,
          avatar: commentObj.av,
        })
      }
    },
    giftProcess(giftObj) {
      // ブロック
      if (this.blockCheck(giftObj.u)) {
        return
      }
      // ギフトログ
      if (giftObj.gt === 2) {
        // 投票
        if (Number(giftObj.g) > 10000 && Number(giftObj.g) <= 10070) {
          // 投票ボール
        } else if (giftObj.g === 1601) {
          // 虹星
          this.addPreGift(giftObj)
        } else if (
          giftObj.g === 1 ||
          giftObj.g === 1001 ||
          giftObj.g === 1002 ||
          giftObj.g === 1003 ||
          giftObj.g === 2 ||
          giftObj.g === 1501 ||
          giftObj.g === 1502 ||
          giftObj.g === 1503 ||
          giftObj.g === 1504 ||
          giftObj.g === 1505
        ) {
          // 無料
          this.addFreeGift(giftObj)
        } else {
          // 星以外のフリーギフト
          this.addPreGift(giftObj)
        }
      } else {
        // 有料
        this.addPreGift(giftObj)
      }
    },
    addPreGift(giftObj) {
      // 使えるギフトのポイントを検索
      const useGiftPoint = this.useGiftList.find((e) => e.gift_id === giftObj.g)
      // 一覧にあれば加算対象
      if (useGiftPoint !== undefined) {
        // 10連
        if (giftObj.n === 10) {
          this.prePoint += Math.floor(
            useGiftPoint.point * giftObj.n * 2.5 * 1.25
          )
        } else {
          this.prePoint += Math.floor(useGiftPoint.point * giftObj.n * 2.5)
        }
      }
      // 既に存在するか確認
      if (
        this.preGiftList.some(
          (e) => e.id === giftObj.u && e.gitId === giftObj.g
        )
      ) {
        for (const i in this.preGiftList) {
          if (
            this.preGiftList[i].id === giftObj.u &&
            this.preGiftList[i].gitId === giftObj.g
          ) {
            this.preGiftList[i].num += giftObj.n
            this.preGiftList[i].name = giftObj.ac
            this.preGiftList[i].avatar = giftObj.av
          }
        }
        let preGiftData = null
        for (let i = 0; i < this.preGiftList.length; i++) {
          if (
            this.preGiftList[i].id === giftObj.u &&
            this.preGiftList[i].gitId === giftObj.g
          ) {
            preGiftData = this.preGiftList[i]
            this.preGiftList.splice(i, 1)
            this.preGiftList.unshift(preGiftData)
          }
        }
      } else {
        this.preGiftList.unshift({
          id: giftObj.u,
          name: giftObj.ac,
          gitId: giftObj.g,
          num: giftObj.n,
          flg: giftObj.ua,
          avatar: giftObj.av,
        })
      }
    },
    addFreeGift(giftObj) {
      // 10連
      if (giftObj.n === 10) {
        this.freePoint += Math.floor(giftObj.n * 1.25)
      } else {
        this.freePoint += giftObj.n
      }
      // 既に存在するか確認
      if (this.freeGiftList.some((e) => e.id === giftObj.u)) {
        for (const i in this.freeGiftList) {
          if (this.freeGiftList[i].id === giftObj.u) {
            this.freeGiftList[i].num += giftObj.n
            this.freeGiftList[i].gitId = giftObj.g
            this.freeGiftList[i].name = giftObj.ac
            this.freeGiftList[i].avatar = giftObj.av
          }
        }
        let freeGiftData = null
        for (let i = 0; i < this.freeGiftList.length; i++) {
          if (this.freeGiftList[i].id === giftObj.u) {
            freeGiftData = this.freeGiftList[i]
            this.freeGiftList.splice(i, 1)
            this.freeGiftList.unshift(freeGiftData)
          }
        }
      } else {
        this.freeGiftList.unshift({
          id: giftObj.u,
          name: giftObj.ac,
          gitId: giftObj.g,
          num: giftObj.n,
          flg: giftObj.ua,
          avatar: giftObj.av,
        })
      }
    },
    telopProcess(socketTelop) {
      if (socketTelop.telop != null) {
        this.telop = socketTelop.telop
      }
    },
    visitProcess(visitObj) {
      this.commentList.unshift({
        id: visitObj.u,
        name: '',
        comment: visitObj.m,
        flg: visitObj.c,
        avatar: '',
      })
    },
    setTimer(startTime) {
      this.timer = setInterval(() => {
        const pastTime = new Date(startTime * 1000)
        const diffTime = Date.now() - pastTime.getTime()
        const passSeconds = Math.floor(diffTime / 1000)
        const num = passSeconds
        const timeH = Math.floor((num % (24 * 60 * 60)) / (60 * 60))
        const timeM = Math.floor(((num % (24 * 60 * 60)) % (60 * 60)) / 60)
        const timeS = ((num % (24 * 60 * 60)) % (60 * 60)) % 60
        const timeHMS = timeH + '時間' + timeM + '分' + timeS + '秒'
        this.elapsedTime = timeHMS
      }, 1000)
    },
    async update() {
      // インフォメーション
      await this.getApi(
        `${constants.url.sub}${constants.url.room.profile}${this.roomId}`
      ).then((response) => {
        this.startView = this.roomData === null ? 0 : this.roomData.view_num
        this.roomData = response.data
      })
    },
    formatTime(unixTime) {
      return moment(unixTime * 1000).format('H時 mm分 ss秒')
    },
    formatNum(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    },
    getListener(id) {
      this.listenerData = {}
      axios
        .get(`${this.api}${constants.url.user.profile}${id}`)
        .then((response) => {
          this.listenerData = response.data
          this.listenerData.account_id = id
          this.listenerData.block = this.blockUser.includes(id)
          document.getElementById('open').click()
        })
    },
    blockCheck(id) {
      return this.blockUser.includes(id)
    },
    addBlock(id) {
      this.listenerData.block = true
      this.blockUser.push(id)
    },
    delBlock(id) {
      // ブロックリストから削除
      this.blockUser = this.blockUser.filter((user) => user !== id)
    },
    addLog() {
      this.streaminglog.push({
        id: Math.floor(new Date().getTime() / 1000),
        comment: this.commentList,
        free: this.freeGiftList,
        pre: this.preGiftList,
        count: this.countList,
        ranking: this.rankingList,
        info: {
          startedAt: this.roomData.current_live_started_at,
          followerNum: this.roomData.follower_num,
          viewNum: this.roomData.view_num,
          freePoint: this.freePoint,
          prePoint: this.prePoint,
          countPoint: this.countPoint,
        },
      })
      this.$store.commit('setStreaminglog', this.streaminglog)
    },
    end() {
      this.socket.close()
      clearInterval(this.checkPing)
      clearInterval(this.timer)
      this.addLog()
      location.reload()
    },
  },
}
</script>

<style>
#comment {
  height: 80vh;
}

/* #ranking {
  height: 80vh;
} */

.gift {
  height: 39vh;
}
</style>