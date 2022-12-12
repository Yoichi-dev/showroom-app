<template>
  <v-col cols="12" sm="6">
    <v-card elevation="10" height="40vh">
      <v-tabs v-model="tab" color="deep-purple accent-4">
        <v-tab href="#tab-1"> ライブ </v-tab>
        <v-tab href="#tab-2"> 累計 </v-tab>
        <v-tab v-if="eventFlg" href="#tab-3"> イベント貢献 </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <v-simple-table height="35.5vh">
            <tbody>
              <tr
                v-for="(item, i) in rankingData"
                :key="i"
                class="pointer"
                @click="openProfile(item.user.user_id)"
              >
                <td class="text-nowrap mr-0 pr-1">{{ item.order_no }}位</td>
                <td class="mx-0 px-0">
                  <v-img
                    max-height="25"
                    max-width="25"
                    :src="item.user.avatar_url"
                  />
                </td>
                <td class="mr-0 pr-0">
                  <span v-if="item.user.user_id === developer">
                    <v-chip
                      class="mb-1"
                      color="purple"
                      text-color="white"
                      small
                    >
                      {{ `開発者${item.flg === 2 ? '(初見)' : ''}` }}
                    </v-chip>
                    {{ item.user.name }}
                  </span>
                  <span v-else>
                    <span>{{ $nameCut(item.user.name) }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-simple-table height="35.5vh">
            <tbody>
              <tr
                v-for="(item, i) in summaryRanking"
                :key="i"
                class="pointer"
                @click="openProfile(item.user_id)"
              >
                <td class="text-nowrap mr-0 pr-1">{{ item.order }}位</td>
                <td class="mx-0 px-0">
                  <v-img
                    max-height="25"
                    max-width="25"
                    :src="item.avatar_url"
                  />
                </td>
                <td class="mr-0 pr-0">
                  <span v-if="item.user_id === developer">
                    <v-chip
                      class="mb-1"
                      color="purple"
                      text-color="white"
                      small
                    >
                      開発者
                    </v-chip>
                    {{ item.name }}
                  </span>
                  <span v-else>
                    <span>{{ $nameCut(item.name) }}</span>
                  </span>
                </td>
                <td class="text-nowrap pr-3">
                  {{ $numberFormat(item.visit_count) }}回
                </td>
                <td class="ml-0 pl-0">{{ $numberFormat(item.point) }}pt</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn
            class="mb-10 mr-3"
            elevation="2"
            color="green"
            dark
            small
            absolute
            right
            fab
            bottom
            @click="reloadRanking()"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-tab-item>
        <v-tab-item v-if="eventFlg" value="tab-3">
          <v-simple-table height="35.5vh">
            <tbody>
              <tr
                v-for="(item, i) in contributionRanking"
                :key="i"
                class="pointer"
                @click="openProfile(item.user_id)"
              >
                <td class="text-nowrap mr-0 pr-1">{{ item.rank }}位</td>
                <td class="ml-0 pl-0">
                  <span v-if="item.user_id === developer">
                    <v-chip
                      class="mb-1"
                      color="purple"
                      text-color="white"
                      small
                    >
                      開発者
                    </v-chip>
                    {{ item.name }}
                  </span>
                  <span v-else>
                    <span>{{ $nameCut(item.name) }}</span>
                  </span>
                </td>
                <td class="ml-0 pl-0">{{ $numberFormat(item.point) }}pt</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn
            class="mb-10 mr-3"
            elevation="2"
            color="green"
            dark
            small
            absolute
            right
            fab
            bottom
            @click="reloadEventRanking()"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <UserProfile ref="profile" />
  </v-col>
</template>

<script>
import axios from '~/plugins/axios'
import UserProfile from '~/components/UserProfile'
import constants from '~/constants'

export default {
  name: 'RankingTable',
  components: {
    UserProfile,
  },
  props: {
    rankingData: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    developer: '',
    tab: null,
    summaryRanking: [],
    contributionRanking: [],
    eventFlg: false,
  }),
  watch: {
    eventFlg() {
      this.reloadEventRanking()
    },
  },
  mounted() {
    this.developer = constants.developer
    this.reloadRanking()
  },
  methods: {
    openProfile(id) {
      this.$refs.profile.getUserData(id)
    },
    reloadRanking() {
      if (localStorage.room_id) {
        this.summaryRanking = []
        // 累計ランキング
        axios
          .post(constants.url.showroom_api, {
            category: 'live',
            type: 'summary_ranking',
            key: localStorage.room_id,
          })
          .then((res) => {
            this.summaryRanking = res.data.ranking
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    reloadEventRanking() {
      if (localStorage.room_id) {
        this.contributionRanking = []
        // 貢献ランキング
        axios
          .post(constants.url.showroom_api, {
            category: 'event',
            type: 'contribution_ranking',
            key: localStorage.room_id,
          })
          .then((res) => {
            this.contributionRanking = res.data.ranking
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
  },
}
</script>

<style scoped>
.text-nowrap {
  white-space: nowrap;
}

.pointer {
  cursor: pointer;
}
</style>

<style>
.v-slide-group__prev {
  display: none !important;
}
</style>