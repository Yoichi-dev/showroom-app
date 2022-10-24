<template>
  <div>
    <v-container fluid>
      <OnliveInfo :info-data="infoObj" />
      <v-row class="mt-0">
        <CommentTable
          :telop-data="telop"
          :comment-data="
            $vuetify.breakpoint.name === 'xs' ||
            $vuetify.breakpoint.name === 'sm'
              ? commentObjUn
              : commentObj
          "
        />
        <v-col>
          <v-row>
            <GiftTable :gitf-data="freeGiftObj" :gift-flg="false" />
            <GiftTable ref="prGift" :gitf-data="preGiftObj" :gift-flg="true" />
            <CountTable :count-data="countObj" />
            <RankingTable :ranking-data="rankingObj" />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import OnliveInfo from '~/components/OnliveInfo'
import CommentTable from '~/components/CommentTable'
import GiftTable from '~/components/GiftTable'
import CountTable from '~/components/CountTable'
import RankingTable from '~/components/RankingTable'
import {
  comment,
  commentCountCheck,
  giftCheck,
  freeGift,
  preGift,
  count,
  info,
} from '~/plugins/liveDataEdit'
import constants from '~/constants'

export default {
  name: 'OnlivePage',
  components: {
    OnliveInfo,
    CommentTable,
    GiftTable,
    CountTable,
    RankingTable,
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
  data: () => ({
    title: 'オンライブ',
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
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    if (
      !sessionStorage.room_status ||
      sessionStorage.room_status === undefined ||
      sessionStorage.room_status === null ||
      sessionStorage.room_status === 'null'
    ) {
      this.$router.push('/')
      return
    }

    this.roomStatus = JSON.parse(sessionStorage.room_status)

    if (localStorage.use_gifts !== undefined) {
      this.useGiftList = JSON.parse(localStorage.use_gifts)
    }

    this.infoObj.isOfficial = this.roomStatus.is_official

    this.connect(this.roomStatus.broadcast_key)

    this.infoObj.startTime = this.roomStatus.started_at

    this.setTimer(JSON.parse(sessionStorage.room_status).started_at)

    // コメント
    axios
      .get(`${constants.url.live.commentLog}${this.roomStatus.room_id}`)
      .then((res) => {
        for (let i = res.data.comment_log.length - 1; i >= 0; i--) {
          const commentObj = {
            ac: res.data.comment_log[i].name,
            av: res.data.comment_log[i].avatar_id,
            cm: res.data.comment_log[i].comment,
            created_at: res.data.comment_log[i].created_at,
            u: res.data.comment_log[i].user_id,
            ua: res.data.comment_log[i].ua,
          }
          if (!this.blockCheck(commentObj.u)) {
            if (commentCountCheck(commentObj)) {
              // コメント
              this.commentObj.push(comment(commentObj))
              if (
                this.$vuetify.breakpoint.name === 'xs' ||
                this.$vuetify.breakpoint.name === 'sm'
              ) {
                this.commentObjUn.unshift(comment(commentObj))
              }
            } else {
              // カウント
              this.deduplicationCount(count(commentObj))
            }
          }
        }
      })
    ;(async () => {
      // 利用可能ギフト
      await axios
        .get(`${constants.url.live.giftList}${this.roomStatus.room_id}`)
        .then((res) => {
          this.useGiftList = res.data.normal
          this.$refs.prGift.useGiftList = res.data.normal
          localStorage.use_gifts = JSON.stringify(res.data.normal)
        })

      // 有料ギフト
      await axios
        .get(`${constants.url.live.giftLog}${this.roomStatus.room_id}`)
        .then((res) => {
          for (const giftObjsRaw of res.data.gift_log) {
            const giftObj = {
              u: giftObjsRaw.user_id,
              ac: giftObjsRaw.name,
              g: giftObjsRaw.gift_id,
              n: giftObjsRaw.num,
              ua: giftObjsRaw.ua,
              av: giftObjsRaw.avatar_id,
            }
            const giftNum = Math.floor(giftObjsRaw.num / 10)
            const giftNumRemainder = giftObjsRaw.num % 10
            if (giftNum === 0) {
              this.deduplicationPreGift(preGift(giftObj))
            } else {
              for (let i = 0; i < giftNum; i++) {
                giftObj.n = 10
                this.deduplicationPreGift(preGift(giftObj))
              }
              if (giftNumRemainder !== 0) {
                giftObj.n = giftNumRemainder
                this.deduplicationPreGift(preGift(giftObj))
              }
            }
          }
        })
    })()

    // 来場者
    axios
      .get(`${constants.url.room.profile}${this.roomStatus.room_id}`)
      .then((res) => {
        this.infoObj.startView = res.data.view_num
        this.infoObj.view = res.data.view_num
        this.infoObj.startFollwer = res.data.follower_num
        this.infoObj.follwer = res.data.follower_num
      })

    // ランキング
    axios
      .get(`${constants.url.live.stageUserList}${this.roomStatus.room_id}`)
      .then((res) => {
        this.rankingObj = res.data.stage_user_list
      })

    // テロップ
    axios
      .get(`${constants.url.room.telop}${this.roomStatus.room_id}`)
      .then((res) => {
        this.telop = res.data
      })
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
                  this.$vuetify.breakpoint.name === 'sm'
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
              this.$vuetify.breakpoint.name === 'sm'
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
        .get(`${constants.url.room.profile}${this.roomStatus.room_id}`)
        .then((res) => {
          this.infoObj.view = res.data.view_num
          this.infoObj.follwer = res.data.follower_num
        })
      // ランキング取得
      await axios
        .get(`${constants.url.live.stageUserList}${this.roomStatus.room_id}`)
        .then((res) => {
          this.rankingObj = res.data.stage_user_list
        })
      // テロップ
      await axios
        .get(`${constants.url.room.telop}${this.roomStatus.room_id}`)
        .then((res) => {
          this.telop = res.data
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
          this.$router.push('/')
        })
    },
  },
}
</script>
