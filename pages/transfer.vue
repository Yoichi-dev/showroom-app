<template>
  <div>
    <v-container>
      <v-row v-if="vuexFlg" class="mt-5">
        <v-col>
          <p class="text-h5">データ移行</p>
          旧βバージョン(Ver.1.x.x)のログデータを移行する事ができます
          <p v-if="!dataFlg && !errorFlg" class="mt-15">
            過去ログが存在しません
          </p>
          <p v-if="errorFlg" class="mt-15 red--text">
            過去ログが破損しています<br />
            修復希望の方は
            <a
              :href="`https://www.twitter.com/messages/compose?recipient_id=1278265302921342976&text=過去ログが破損しています%0D%0Aroom_id:${room_id}%0D%0Aroom_url_key:${room_url_key}%0D%0Aid:${uuid}`"
              target="_blank"
            >
              連絡
            </a>
            お願いします
          </p>

          <p v-if="oldLog !== null && oldLog.streaminglog.length !== 0">
            <v-btn
              color="blue-grey"
              class="ma-2 white--text"
              :loading="loading"
              :disabled="loading"
              style="text-transform: none"
              @click="transfer"
            >
              WatchLogクラウドに保存
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </p>

          <v-simple-table
            v-if="oldLog !== null && oldLog.streaminglog.length !== 0"
            class="mt-5"
          >
            <tbody>
              <tr v-for="(log, index) in oldLog.streaminglog" :key="index">
                <td>{{ timeFormat(log.info.startedAt) }}のログ</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row v-else class="mt-5">
        <v-col>
          <p class="text-h5">データ移行</p>
          旧βバージョン(Ver.1.x.x)のログデータを移行する事ができます
          <p v-if="!dataFlg && !errorFlg" class="mt-15">
            移行するデータはありません
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import constants from '~/constants'
import client from '~/plugins/contentful'

export default {
  name: 'TransferPage',
  async asyncData({ redirect }) {
    if (!localStorage.room_url_key) {
      redirect('/')
      return
    }

    let maintenance = []
    await client
      .getEntries({
        content_type: 'maintenance',
      })
      .then((res) => (maintenance = res.items[0].fields))
      .catch()

    if (maintenance.flg) {
      redirect('/maintenance')
      return
    }

    return { maintenance }
  },
  data: () => ({
    title: 'データ引継ぎ',
    oldLog: null,
    dataFlg: false,
    errorFlg: false,
    optimizationData: null,
    room_id: null,
    room_url_key: null,
    uuid: null,
    loader: null,
    loading: false,
    vuexFlg: true,
  }),
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    this.room_id = localStorage.room_id
    this.room_url_key = localStorage.room_url_key
    this.uuid = localStorage.uuid

    if (localStorage.vuex !== null && localStorage.vuex !== undefined) {
      try {
        this.oldLog = JSON.parse(localStorage.vuex)
        this.dataFlg = true
      } catch (e) {
        axios
          .post(constants.url.watchlog.corruption, {
            uuid: this.uuid,
            log_data: localStorage.vuex,
          })
          .then((res) => {
            localStorage.removeItem('vuex')
          })

        this.errorFlg = true
      }
    } else {
      this.vuexFlg = false
    }
  },
  methods: {
    async transfer() {
      this.loader = 'アップロード中...'
      this.loading = true
      const insertData = this.oldLog.streaminglog.map((streaminglog) =>
        axios.post(
          constants.url.watchlog.addlog,
          this.optimization(streaminglog)
        )
      )
      await Promise.all([...insertData])
      localStorage.removeItem('vuex')
      this.loader = null
      this.loading = false
      this.$router.push('/log')
    },
    optimization(oldLogList) {
      // ログデータの最適化
      const listenerList = []
      const commentList = []
      const countList = []
      const freeList = []
      const preList = []
      const rankingList = []

      // コメント
      oldLogList.comment
        .slice()
        .reverse()
        .forEach((comment) => {
          if (
            listenerList.find(
              (listener) => listener.id === Number(comment.id)
            ) === undefined &&
            comment.flg !== 'FF6C1A'
          ) {
            listenerList.push({
              id: Number(comment.id),
              name: comment.name,
              av: comment.avatar,
              flg: comment.flg,
            })
          }
          commentList.push({
            id: Number(comment.id),
            cm: comment.comment,
            flg: comment.flg,
          })
        })

      // カウント
      for (let i = 0; i < oldLogList.count.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === Number(oldLogList.count[i].id)
          ) === undefined
        ) {
          listenerList.push({
            id: Number(oldLogList.count[i].id),
            name: oldLogList.count[i].name,
            av: oldLogList.count[i].avatar,
            flg: oldLogList.count[i].flg,
          })
        }
        countList.push({
          id: Number(oldLogList.count[i].id),
          num: oldLogList.count[i].num,
        })
      }

      // 無料ギフト
      for (let i = 0; i < oldLogList.free.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === Number(oldLogList.free[i].id)
          ) === undefined
        ) {
          listenerList.push({
            id: Number(oldLogList.free[i].id),
            name: oldLogList.free[i].name,
            av: oldLogList.free[i].avatar,
            flg: oldLogList.free[i].flg,
          })
        }
        freeList.push({
          id: Number(oldLogList.free[i].id),
          gid: oldLogList.free[i].gitId,
          num: oldLogList.free[i].num,
        })
      }

      // 有料ギフト
      for (let i = 0; i < oldLogList.pre.length; i++) {
        if (
          listenerList.find(
            (listener) => listener.id === Number(oldLogList.pre[i].id)
          ) === undefined
        ) {
          listenerList.push({
            id: Number(oldLogList.pre[i].id),
            name: oldLogList.pre[i].name,
            av: oldLogList.pre[i].avatar,
            flg: oldLogList.pre[i].flg,
          })
        }
        preList.push({
          id: Number(oldLogList.pre[i].id),
          gid: oldLogList.pre[i].gitId,
          num: oldLogList.pre[i].num,
        })
      }

      // ランキング
      for (let i = 0; i < oldLogList.ranking.length; i++) {
        if (
          listenerList.find(
            (listener) =>
              listener.id === Number(oldLogList.ranking[i].user.user_id)
          ) === undefined
        ) {
          listenerList.push({
            id: Number(oldLogList.ranking[i].user.user_id),
            name: oldLogList.ranking[i].user.name,
            av: oldLogList.ranking[i].user.avatar_id,
            flg: 3,
          })
        }
        rankingList.push({
          id: Number(oldLogList.ranking[i].user.user_id),
          rank: oldLogList.ranking[i].rank,
        })
      }

      // インフォ
      const infoObj = {
        count: oldLogList.info.countPoint,
        elapsedTime: '',
        follwer: oldLogList.info.followerNum,
        free: oldLogList.info.freePoint,
        pre: oldLogList.info.prePoint,
        startFollwer: oldLogList.info.followerNum,
        startTime: oldLogList.info.startedAt,
        startView: '',
        view: oldLogList.info.viewNum,
      }

      // 保存
      const saveLog = {
        id: oldLogList.info.startedAt,
        info: infoObj,
        comment: commentList,
        count: countList,
        free: freeList,
        pre: preList,
        listener: listenerList,
        ranking: rankingList,
        telop: '',
      }

      return {
        uuid: this.uuid,
        log_id: oldLogList.info.startedAt,
        log_json: saveLog,
      }
    },
    timeFormat(time) {
      return moment(time * 1000).format('llll')
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>