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
          sub: `無料 ${formatNum(freePoint)}pt | 有料 ${formatNum(
            prePoint
          )}pt | カウント ${formatNum(countPoint)}pt`,
          icon: 'star',
        }"
      />

      <Info
        :info="{
          title: 'フォロワー',
          main: `${formatNum(followerNum)}人`,
          sub: '',
          icon: 'heart',
        }"
      />

      <Info
        :info="{
          title: '来場者',
          main: `${formatNum(viewNum)}人`,
          sub: '',
          icon: 'users',
        }"
      />

      <Info
        :info="{
          title: '配信開始時間',
          main: formatTime(startedAt),
          sub: '',
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
              <!-- <Count :count="countList" @parentMethod="getListener" /> -->
            </div>
            <div>
              <Count :count="countList" @parentMethod="getListener" />
              <Ranking :ranking="rankingList" @parentMethod="getListener" />
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
  name: 'HistoryPage',
  data() {
    return {
      title: 'ログ履歴',
      api: null,
      telop: '',
      useGiftList: [],
      rankingList: [],
      countList: [],
      commentList: [],
      preGiftList: [],
      freeGiftList: [],
      freePoint: 0,
      prePoint: 0,
      countPoint: 0,
      follower: 0,
      view: 0,
      startedAt: 0,
      viewNum: 0,
      followerNum: 0,
      listenerData: {},
      blockUser: [],
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
      }
      if (
        this.$store.state.streaminglog !== null &&
        this.$route.query.id !== undefined
      ) {
        for (const i in this.$store.state.streaminglog) {
          if (
            String(this.$store.state.streaminglog[i].id) ===
            this.$route.query.id
          ) {
            this.commentList = this.$store.state.streaminglog[i].comment
            this.freeGiftList = this.$store.state.streaminglog[i].free
            this.preGiftList = this.$store.state.streaminglog[i].pre
            this.countList = this.$store.state.streaminglog[i].count
            this.rankingList = this.$store.state.streaminglog[i].ranking
            this.followerNum =
              this.$store.state.streaminglog[i].info.followerNum
            this.viewNum = this.$store.state.streaminglog[i].info.viewNum
            this.startedAt = this.$store.state.streaminglog[i].info.startedAt
            this.freePoint = this.$store.state.streaminglog[i].info.freePoint
            this.prePoint = this.$store.state.streaminglog[i].info.prePoint
            this.countPoint = this.$store.state.streaminglog[i].info.countPoint
          }
        }
        this.streaminglog = this.$store.state.streaminglog
      } else {
        this.$router.push('/')
      }
    }, 0)
  },
  methods: {
    getApi(url) {
      return axios.get(url)
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
      this.blockUser = this.blockUser.filter((user) => user !== id)
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