<template>
  <main class="uk-container uk-margin-top">
    <div>
      <div class="uk-text-large">ルーム検索・登録</div>
      <div class="uk-text-small">
        本アプリを使用するには事前にルームを登録する必要があります<br />
        （SRのルーム検索機能で検索出来ない事は検索できません）
      </div>
    </div>
    <div class="uk-margin">
      <div class="uk-search uk-search-default">
        <span uk-search-icon></span>
        <input
          v-model="searchText"
          class="uk-search-input"
          type="search"
          placeholder="ルーム名"
          :disabled="searchFlg"
        />
      </div>
      <button
        class="uk-button uk-button-default"
        :disabled="searchFlg"
        @click="search()"
      >
        {{ inputText }}
      </button>
      <div v-if="searchFlg" uk-spinner></div>
    </div>
    <hr />
    <div v-if="searchList.length === 10" class="uk-text-small uk-margin-bottom">
      検索結果は上位10件のみ表示されます
    </div>
    <div class="uk-grid-small uk-child-width-expand@s uk-text-center" uk-grid>
      <div
        v-for="(item, index) in searchList"
        :key="index"
        class="uk-width-1-3@m pointer"
        @click="selectRoom(item)"
      >
        <div class="uk-card-hover uk-card uk-card-default">
          <div class="uk-card-media-top">
            <img :src="item.img" alt="" />
          </div>
          <div class="uk-card-body">
            <p>
              {{ item.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import constants from '~/constants'
import pkg from '~/package.json'

export default {
  name: 'SearchPage',
  data() {
    return {
      title: 'ルーム検索',
      searchList: [],
      searchText: '',
      inputText: '検索',
      searchFlg: false,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    async search() {
      if (this.searchText.length === 0) {
        return
      }

      const keyword = this.searchText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

      this.searchFlg = true
      this.inputText = '検索中...'

      let apiFlg = true

      await axios
        .get(`${constants.url.main}/${constants.url.search}${keyword}`)
        .then((response) => {
          this.searchList = response.data
          if (response.data.length === 0) {
            alert('検索結果がありません\n条件を変えて検索してください')
          }
        })
        .catch((e) => {
          if (e.response && e.response.status === 401) {
            alert('1日の初期化回数を越えました')
          } else {
            apiFlg = false
          }
        })
        .finally(() => {
          this.searchFlg = false
          this.inputText = '検索'
        })

      if (!apiFlg) {
        this.subApiSearch(keyword)
      }
    },
    async subApiSearch(keyword) {
      this.searchFlg = true
      this.inputText = '検索中...'

      await axios
        .get(`${constants.url.sub}/${constants.url.search}${keyword}`)
        .then((response) => {
          this.searchList = response.data
          if (response.data.length === 0) {
            alert('検索結果がありません\n条件を変えて検索してください')
          }
          // IPの関係でメインAPIが使えない人用
          this.$store.commit('setApiFlg', false)
        })
        .catch((e) => {
          alert('エラーが発生しました')
        })
        .finally(() => {
          this.searchFlg = false
          this.inputText = '検索'
        })
    },
    selectRoom(room) {
      if (constants.blockRoom.includes(room.id)) {
        alert('このルームは登録できません')
        return
      }
      if (confirm(`${room.title}を登録しますか？`)) {
        this.$store.commit('setRoomid', room.id)
        this.$store.commit('setUrl', room.url)
        this.$store.commit('setVersion', pkg.version)
        this.$router.push('/')
      }
    },
  },
}
</script>
