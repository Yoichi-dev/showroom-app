<template>
  <div>
    <v-container fluid>
      <OnliveInfo :info-data="infoObj" />
      <v-row class="mt-0">
        <CommentTable
          :telop-data="telop"
          :comment-data="
            $vuetify.breakpoint.name === 'xs' ||
            $vuetify.breakpoint.name === 'sm' ||
            $vuetify.breakpoint.name === 'md'
              ? commentObjUn
              : commentObj
          "
        />
        <v-col>
          <v-row>
            <GiftTable :gitf-data="freeGiftObj" :gift-flg="false" />
            <GiftTable ref="prGift" :gitf-data="preGiftObj" :gift-flg="true" />
            <CountTable :count-data="countObj" />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" timeout="60000" color="red accent-4" top>
      プレミアムライブは読み込みに時間がかかります...
    </v-snackbar>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import OnliveInfo from '~/components/OnliveInfo'
import CommentTable from '~/components/CommentTable'
import GiftTable from '~/components/GiftTable'
import CountTable from '~/components/CountTable'
import {
  comment,
  commentCountCheck,
  giftCheck,
  freeGift,
  preGift,
  count,
  info,
} from '~/plugins/liveDataEdit'
import contentful from '~/plugins/contentful'
import constants from '~/constants'

export default {
  name: 'PremiumPage',
  components: {
    OnliveInfo,
    CommentTable,
    GiftTable,
    CountTable,
  },
  beforeRouteLeave(to, from, next) {
    if (this.socket !== null) {
      this.socket.close()
      clearInterval(this.socketPing)
      clearInterval(this.timer)
    }
    next()
  },
  layout: 'onlive',
  async asyncData({ redirect }) {
    if (!localStorage.room_url_key) {
      redirect('/')
      return
    }

    if (!sessionStorage.premium) {
      redirect('/')
      return
    }

    const maintenance = await contentful
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => res.items[0].fields)

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    // const status = await axios.post(constants.url.showroom_api, {
    //   category: 'room',
    //   type: 'profile',
    //   key: localStorage.room_id,
    // })

    // if (status.data.is_onlive !== true || status.data.premium_room_type !== 1) {
    //   if (status.data.is_onlive) {
    //     redirect('/onlive')
    //     return
    //   } else {
    //     redirect('/')
    //     return
    //   }
    // }

    return { roomStatus: null }
  },
  data: () => ({
    title: 'プレミアムライブ',
    telop: '',
    socket: null,
    socketPing: null,
    timer: null,
    infoObj: {
      free: 0,
      pre: 0,
      count: 0,
      follwer: 0,
      startFollwer: 0,
      view: 0,
      startView: 0,
      startTime: 0,
      elapsedTime: 0,
      isOfficial: true,
    },
    commentObj: [],
    commentObjUn: [],
    freeGiftObj: [],
    preGiftObj: [],
    countObj: [],
    rankingObj: [],
    useGiftList: [],
    allThrowList: [],
    roomStatus: null,
    overlay: true,
    snackbar: true,
    livePing: null,
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.livePing = setInterval(() => {
      axios
        .post(constants.url.showroom_api, {
          category: 'live',
          type: 'onlives',
          key: new Date().getTime(),
        })
        .then((res) => {
          const premiumList = []
          for (let i = 0; i < res.data.onlives.length; i++) {
            if (
              res.data.onlives[i].genre_id >= 100 &&
              res.data.onlives[i].genre_id <= 200
            ) {
              const check = res.data.onlives[i].lives.find(
                (e) => e.premium_room_type === 1
              )
              if (check !== undefined) {
                premiumList.push(check)
              }
            }
          }
          if (premiumList.length !== 0) {
            for (const data of premiumList) {
              if (data.room_id === Number(localStorage.room_id)) {
                this.overlay = false
                this.snackbar = false

                this.roomStatus = data

                this.telop = data.telop
                this.infoObj.startTime = data.started_at
                this.setTimer(data.started_at)

                this.infoObj.isOfficial = data.genre_id !== 200

                this.infoObj.startView = data.view_num
                this.infoObj.view = data.view_num
                this.infoObj.startFollwer = data.follower_num
                this.infoObj.follwer = data.follower_num

                clearInterval(this.livePing)
                // 接続
                this.connect(data.bcsvr_key)
                break
              }
            }
          }
        })
    }, 5000)

    if (localStorage.use_gifts !== undefined) {
      this.useGiftList = JSON.parse(localStorage.use_gifts)
      this.$refs.prGift.useGiftList = JSON.parse(localStorage.use_gifts)
    }
  },
  methods: {
    connect(bcsvrKey) {
      // 接続
      this.socket = new WebSocket(constants.ws)
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send(`SUB\t${bcsvrKey}`)
      }
      // 疎通確認
      this.socketPing = setInterval(() => {
        this.socket.send('PING\tshowroom')
        this.update()
      }, 60000)
      // エラー発生時
      this.socket.onerror = (e) => {
        this.socket.close()
        this.socket = null
        clearInterval(this.socketPing)
        this.connect(this.roomStatus.broadcast_key)
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
          this.socket = null
          clearInterval(this.socketPing)
          this.connect(this.roomStatus.broadcast_key)
        }

        // JSON変換
        const msgJson = JSON.parse(data.data.split(`MSG\t${bcsvrKey}`)[1])

        switch (msgJson.t) {
          case '1':
            if (!this.blockCheck(msgJson.u)) {
              if (commentCountCheck(msgJson)) {
                // コメント
                this.commentObj.push(comment(msgJson))
                if (
                  this.$vuetify.breakpoint.name === 'xs' ||
                  this.$vuetify.breakpoint.name === 'sm' ||
                  this.$vuetify.breakpoint.name === 'md'
                ) {
                  this.commentObjUn.unshift(comment(msgJson))
                }
              } else {
                // カウント
                this.deduplicationCount(count(msgJson))
              }
            }
            break
          case '2':
            if (!this.blockCheck(msgJson.u)) {
              // ギフト
              if (giftCheck(msgJson)) {
                // 無料
                this.deduplicationFreeGift(freeGift(msgJson))
              } else {
                // 有料
                this.deduplicationPreGift(preGift(msgJson))
              }
            }
            break
          case 3:
            // console.log('アンケート開始' + msgJson.t)
            break
          case 4:
            // console.log('アンケート結果' + msgJson.v)
            break
          case 5:
            // console.log(new Date(msgJson.created_at * 1000))
            break
          case 6:
            // console.log('不明')
            // console.log(msgJson)
            break
          case 8:
            this.telop = msgJson.telop
            break
          case 11:
            // console.log('自動投稿' + msgJson.n)
            break
          case 17:
            // console.log('不明')
            // console.log(msgJson)
            break
          case 18:
            this.commentObj.push(info(msgJson))
            if (
              this.$vuetify.breakpoint.name === 'xs' ||
              this.$vuetify.breakpoint.name === 'sm' ||
              this.$vuetify.breakpoint.name === 'md'
            ) {
              this.commentObjUn.unshift(info(msgJson))
            }
            break
          case 100:
            // console.log('不明' + msgJson.created_at)
            break
          case 101:
            // console.log('配信終了')
            this.socket.close()
            clearInterval(this.socketPing)
            clearInterval(this.timer)
            sessionStorage.room_status = null
            this.endStream(msgJson.created_at)
            // console.log('切断')
            break
          case 102:
            // console.log('アンケート終了' + msgJson.created_at)
            break
          default:
          // console.log(msgJson)
        }
      }
    },
    deduplicationCount(msgJson) {
      // 既に存在するか確認
      if (this.countObj.some((e) => e.id === msgJson.id)) {
        for (const i in this.countObj) {
          if (this.countObj[i].id === msgJson.id) {
            this.countObj[i].num = msgJson.num
            this.countObj[i].name = msgJson.name
            this.countObj[i].av = msgJson.av
          }
        }
        let countData = null
        for (let i = 0; i < this.countObj.length; i++) {
          if (this.countObj[i].id === msgJson.id) {
            countData = this.countObj[i]
            // 削除
            this.countObj.splice(i, 1)
            // 先頭に追加
            this.countObj.unshift(countData)
          }
        }
      } else {
        // 新規追加
        this.countObj.unshift(msgJson)
      }
      // ポイント計算
      let countPoint = 0
      for (let i = 0; i < this.countObj.length; i++) {
        countPoint += Number(this.countObj[i].num)
      }
      this.infoObj.count = countPoint
    },
    deduplicationFreeGift(msgJson) {
      let throwPoint = 0
      // 全投げ計算
      // TODO:不具合あり
      if (msgJson.n > 10) {
        this.allThrowList.push(msgJson)
        const allThrowcount = this.allThrowList.filter(
          (val) =>
            val.u === msgJson.u &&
            val.n === msgJson.n &&
            val.created_at === msgJson.created_at
        )
        if (allThrowcount.length === 1) {
          throwPoint = msgJson.n * 5
          if (msgJson.n === 99) {
            this.infoObj.free += 590
          } else {
            this.infoObj.free += Math.floor(
              msgJson.n *
                constants.bonusPoint[constants.bonusPoint.length - 1] *
                5
            )
          }
        } else {
          return
        }
      } else {
        throwPoint = msgJson.n
        this.infoObj.free += Math.floor(
          msgJson.n * constants.bonusPoint[msgJson.n - 1]
        )
      }

      // 既に存在するか確認
      if (this.freeGiftObj.some((e) => e.id === msgJson.u)) {
        for (const i in this.freeGiftObj) {
          if (this.freeGiftObj[i].id === msgJson.u) {
            this.freeGiftObj[i].num += throwPoint
            this.freeGiftObj[i].gid = msgJson.g
            this.freeGiftObj[i].name = msgJson.ac
            this.freeGiftObj[i].av = msgJson.av
          }
        }
        let freeGiftData = null
        for (let i = 0; i < this.freeGiftObj.length; i++) {
          if (this.freeGiftObj[i].id === msgJson.u) {
            freeGiftData = this.freeGiftObj[i]
            this.freeGiftObj.splice(i, 1)
            this.freeGiftObj.unshift(freeGiftData)
          }
        }
      } else {
        this.freeGiftObj.unshift({
          id: msgJson.u,
          name: msgJson.ac,
          gid: msgJson.g,
          num: throwPoint,
          flg: msgJson.ua,
          av: msgJson.av,
        })
      }
    },
    deduplicationPreGift(msgJson) {
      // 使えるギフトのポイントを検索
      const useGiftPoint = this.useGiftList.find((e) => e.gift_id === msgJson.g)
      // 一覧にあれば加算対象
      if (useGiftPoint !== undefined) {
        this.infoObj.pre += Math.floor(
          useGiftPoint.point *
            msgJson.n *
            constants.bonusPoint[msgJson.n - 1] *
            constants.giftBonus
        )
      }
      // 既に存在するか確認
      if (
        this.preGiftObj.some((e) => e.id === msgJson.u && e.gid === msgJson.g)
      ) {
        for (const i in this.preGiftObj) {
          if (
            this.preGiftObj[i].id === msgJson.u &&
            this.preGiftObj[i].gid === msgJson.g
          ) {
            this.preGiftObj[i].num += msgJson.n
            this.preGiftObj[i].name = msgJson.ac
            this.preGiftObj[i].av = msgJson.av
          }
        }
        let preGiftData = null
        for (let i = 0; i < this.preGiftObj.length; i++) {
          if (
            this.preGiftObj[i].id === msgJson.u &&
            this.preGiftObj[i].gid === msgJson.g
          ) {
            preGiftData = this.preGiftObj[i]
            this.preGiftObj.splice(i, 1)
            this.preGiftObj.unshift(preGiftData)
          }
        }
      } else {
        this.preGiftObj.unshift({
          id: msgJson.u,
          name: msgJson.ac,
          gid: msgJson.g,
          num: msgJson.n,
          flg: msgJson.ua,
          av: msgJson.av,
        })
      }
    },
    async update() {
      // 配列初期化
      this.allThrowList = []
      // インフォメーション
      await axios
        .post(constants.url.showroom_api, {
          category: 'live',
          type: 'onlives',
          key: new Date().getTime(),
        })
        .then((res) => {
          const premiumList = []
          for (let i = 0; i < res.data.onlives.length; i++) {
            if (
              res.data.onlives[i].genre_id >= 100 &&
              res.data.onlives[i].genre_id <= 200
            ) {
              const check = res.data.onlives[i].lives.find(
                (e) => e.premium_room_type === 1
              )
              if (check !== undefined) {
                premiumList.push(check)
              }
            }
          }
          if (premiumList.length !== 0) {
            for (const data of premiumList) {
              if (data.room_id === Number(localStorage.room_id)) {
                this.infoObj.view = data.view_num
                this.infoObj.follwer = data.follower_num
                this.telop = data.telop
                break
              }
            }
          }
        })
    },
    blockCheck(id) {
      let list = []
      if (localStorage.block_users) {
        list = JSON.parse(localStorage.block_users)
      }
      let blockFlg = false
      for (let i = 0; i < list.length; i++) {
        if (list[i].account_id === id) {
          blockFlg = true
        }
      }
      // admin block
      let adminList = []
      if (localStorage.block) {
        adminList = JSON.parse(localStorage.block)
      }
      if (adminList.userId.includes(id)) {
        blockFlg = true
      }
      return blockFlg
    },
    setTimer(startTime) {
      this.timer = setInterval(() => {
        const pastTime = new Date(startTime * 1000)
        const passSeconds = Math.floor((Date.now() - pastTime.getTime()) / 1000)
        const timeH = Math.floor((passSeconds % (24 * 60 * 60)) / (60 * 60))
        const timeM = Math.floor(
          ((passSeconds % (24 * 60 * 60)) % (60 * 60)) / 60
        )
        const timeS = ((passSeconds % (24 * 60 * 60)) % (60 * 60)) % 60
        this.infoObj.elapsedTime = `${timeH}時間${timeM}分${timeS}秒`
      }, 1000)
    },
    endStream(endTime) {
      // ログデータの最適化
      const listenerList = []
      const commentList = []
      const countList = []
      const freeList = []
      const preList = []
      const rankingList = []

      // コメント
      for (let i = 0; i < this.commentObj.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === this.commentObj[i].id
          ) === undefined &&
          this.commentObj[i].flg !== 'FF6C1A' &&
          this.commentObj[i].flg !== 'follow'
        ) {
          listenerList.push({
            id: this.commentObj[i].id,
            name: this.commentObj[i].name,
            av: this.commentObj[i].av,
            flg: this.commentObj[i].flg,
          })
        }
        commentList.push({
          id: this.commentObj[i].id,
          cm: this.commentObj[i].cm,
          flg: this.commentObj[i].flg,
        })
      }

      // カウント
      for (let i = 0; i < this.countObj.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === this.countObj[i].id
          ) === undefined
        ) {
          listenerList.push({
            id: this.countObj[i].id,
            name: this.countObj[i].name,
            av: this.countObj[i].av,
            flg: this.countObj[i].flg,
          })
        }
        countList.push({
          id: this.countObj[i].id,
          num: this.countObj[i].num,
        })
      }

      // 無料ギフト
      for (let i = 0; i < this.freeGiftObj.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === this.freeGiftObj[i].id
          ) === undefined
        ) {
          listenerList.push({
            id: this.freeGiftObj[i].id,
            name: this.freeGiftObj[i].name,
            av: this.freeGiftObj[i].av,
            flg: this.freeGiftObj[i].flg,
          })
        }
        freeList.push({
          id: this.freeGiftObj[i].id,
          gid: this.freeGiftObj[i].gid,
          num: this.freeGiftObj[i].num,
        })
      }

      // 有料ギフト
      for (let i = 0; i < this.preGiftObj.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === this.preGiftObj[i].id
          ) === undefined
        ) {
          listenerList.push({
            id: this.preGiftObj[i].id,
            name: this.preGiftObj[i].name,
            av: this.preGiftObj[i].av,
            flg: this.preGiftObj[i].flg,
          })
        }
        preList.push({
          id: this.preGiftObj[i].id,
          gid: this.preGiftObj[i].gid,
          num: this.preGiftObj[i].num,
        })
      }

      // ランキング
      for (let i = 0; i < this.rankingObj.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === this.rankingObj[i].user.user_id
          ) === undefined
        ) {
          listenerList.push({
            id: this.rankingObj[i].user.user_id,
            name: this.rankingObj[i].user.name,
            av: this.rankingObj[i].user.avatar_id,
            flg: 3,
          })
        }
        rankingList.push({
          id: this.rankingObj[i].user.user_id,
          rank: this.rankingObj[i].rank,
        })
      }

      // 保存
      const saveLog = {
        id: endTime,
        info: this.infoObj,
        comment: commentList,
        count: countList,
        free: freeList,
        pre: preList,
        listener: listenerList,
        ranking: rankingList,
        telop: this.telop,
      }

      localStorage.tmp_log = JSON.stringify(saveLog)

      axios
        .post(constants.url.watchlog.addlog, {
          uuid: localStorage.uuid,
          log_id: endTime,
          log_json: saveLog,
        })
        .then((res) => {
          localStorage.removeItem('room_status')
          sessionStorage.removeItem('premium')
          this.$router.push('/')
        })
    },
  },
}
</script>
