<template>
  <div>
    <v-container fluid>
      <OnliveInfo :info-data="infoObj" />
      <v-row class="mt-0">
        <CommentTable :telop-data="telop" :comment-data="commentObj" />
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
import constants from '~/constants'

export default {
  name: 'HistoryPage',
  components: {
    OnliveInfo,
    CommentTable,
    GiftTable,
    CountTable,
    RankingTable,
  },
  async asyncData({ redirect, query }) {
    if (query.id === undefined || query.id === null) {
      redirect('/log')
      return
    }
    const res = await axios.post(constants.url.watchlog.getlog, {
      uuid: localStorage.uuid,
      log_id: query.id,
    })
    if (res.data.length !== 1) {
      redirect('/log')
      return
    }
    return { logData: res.data[0] }
  },
  data: () => ({
    telop: '',
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
    },
    commentObj: [],
    freeGiftObj: [],
    preGiftObj: [],
    countObj: [],
    rankingObj: [],
  }),
  mounted() {
    if (localStorage.use_gifts !== null) {
      this.$refs.prGift.useGiftList = JSON.parse(localStorage.use_gifts)
    }
    const dbLog = JSON.parse(this.logData.log_json)

    this.telop = dbLog.telop

    dbLog.comment.forEach((comment) => {
      const listener = dbLog.listener.filter(
        (user) => user.id === comment.id
      )[0]
      if (comment.flg === 'FF6C1A' || comment.flg === 'follow') {
        this.commentObj.push({
          id: comment.id,
          name: '',
          cm: comment.cm,
          flg: comment.flg,
          av: '',
        })
      } else {
        this.commentObj.push({
          id: listener.id,
          name: listener.name,
          cm: comment.cm,
          flg: comment.flg,
          av: listener.av,
        })
      }
    })

    dbLog.count.forEach((count) => {
      const listener = dbLog.listener.filter((user) => user.id === count.id)[0]
      this.countObj.push({
        id: listener.id,
        name: listener.name,
        num: count.num,
        flg: listener.flg,
        av: listener.av,
      })
    })

    dbLog.free.forEach((free) => {
      const listener = dbLog.listener.filter((user) => user.id === free.id)[0]
      this.freeGiftObj.push({
        id: listener.id,
        name: listener.name,
        num: free.num,
        flg: listener.flg,
        av: listener.av,
        gid: free.gid,
      })
    })

    dbLog.pre.forEach((pre) => {
      const listener = dbLog.listener.filter((user) => user.id === pre.id)[0]
      this.preGiftObj.push({
        id: listener.id,
        name: listener.name,
        num: pre.num,
        flg: listener.flg,
        av: listener.av,
        gid: pre.gid,
      })
    })

    dbLog.ranking.forEach((ranking) => {
      const listener = dbLog.listener.filter(
        (user) => user.id === ranking.id
      )[0]
      this.rankingObj.push({
        order_no: ranking.rank,
        flg: listener.flg,
        user: {
          user_id: listener.id,
          name: listener.name,
          avatar_url: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${listener.av}.png?v=92`,
        },
      })
    })

    this.infoObj = dbLog.info
  },
  methods: {
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
      return blockFlg
    },
  },
}
</script>
