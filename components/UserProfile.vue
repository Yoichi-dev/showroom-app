<template>
  <div>
    <v-dialog
      v-if="userDataJson !== null"
      v-model="dialog"
      :max-width="dialogWidth"
    >
      <v-card>
        <v-tabs v-model="tab" color="deep-purple accent-4">
          <v-tab>リスナー情報</v-tab>
          <v-tab v-if="userDataJson.room_profile !== null">ルーム情報</v-tab>
          <v-tab-item>
            <v-card class="mx-auto" outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-img :src="userDataJson.image" />
                    <div class="mt-3">利用中のアバター</div>
                    <v-img max-width="50" :src="userDataJson.avatar_url" />
                    <div v-if="userDataJson.sns_list !== null" class="mt-3">
                      <div>SNS</div>
                      <a
                        v-for="(item, i) in userDataJson.sns_list"
                        :key="i"
                        :href="item.url"
                        target="_blank"
                      >
                        <img :src="item.icon" width="40" height="40" />
                      </a>
                    </div>
                  </v-col>
                  <v-col cols="8">
                    <div v-if="developer === userId">
                      <v-alert shaped outlined type="success">
                        私がWatch Logの開発者だよ
                      </v-alert>
                    </div>
                    <div>リスナーレベル：{{ userDataJson.fan_level }}</div>
                    <p class="text-h5 text--primary">
                      <img
                        v-if="userDataJson.is_sms_authenticated"
                        :src="require('@/assets/svg/sms.svg')"
                      />{{ userDataJson.name }}
                    </p>
                    <div v-if="developer === userId">
                      <v-btn class="ma-2" outlined color="error" disabled>
                        開発者をブロックする事はできません
                      </v-btn>
                    </div>
                    <div v-else>
                      <v-btn
                        v-if="!blockFlg"
                        class="ma-2"
                        outlined
                        color="error"
                        @click="userBlock()"
                      >
                        ブロック
                      </v-btn>
                      <v-btn
                        v-else
                        class="ma-2"
                        outlined
                        color="green"
                        @click="userUnblock(userId)"
                      >
                        ブロック解除
                      </v-btn>
                    </div>

                    <div
                      class="text--primary"
                      style="white-space: pre-wrap; word-wrap: break-word"
                    >
                      {{
                        '\r\n' +
                        userDataJson.description.replace(
                          /\r\n\r\n\r\n/g,
                          '\r\n'
                        )
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="deep-purple accent-4"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="userDataJson.room_profile !== null">
            <v-card class="mx-auto" outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="5">
                    <v-img :src="userDataJson.room_profile.image" />
                    <div v-if="userDataJson.sns_list !== null" class="mt-3">
                      <div>SNS</div>
                      <a
                        v-for="(item, i) in userDataJson.sns_list"
                        :key="i"
                        :href="item.url"
                        target="_blank"
                      >
                        <img :src="item.icon" width="40" height="40" />
                      </a>
                    </div>

                    <div
                      v-if="userDataJson.room_profile.avatar !== null"
                      class="mt-3"
                    >
                      <div>配布中のアバター</div>
                      <img
                        v-for="(item, i) in userDataJson.room_profile.avatar
                          .list"
                        :key="i"
                        :src="item"
                        width="50"
                        height="50"
                      />
                    </div>
                  </v-col>
                  <v-col cols="7">
                    <div v-if="userDataJson.room_profile.is_onlive">
                      <v-alert
                        text
                        dense
                        color="teal"
                        icon="mdi-access-point"
                        border="left"
                      >
                        現在配信中
                      </v-alert>
                    </div>
                    <div>
                      フォロワー数：{{
                        userDataJson.room_profile.follower_num
                      }}人
                    </div>
                    <p class="text-h5 text--primary">
                      {{ userDataJson.room_profile.room_name }}
                    </p>
                    <a
                      :href="userDataJson.room_profile.share_url_live"
                      target="_blank"
                    >
                      <v-btn class="ma-2" outlined color="deep-purple">
                        配信ルーム
                      </v-btn>
                    </a>
                    <a
                      :href="userDataJson.room_profile.share_url"
                      target="_blank"
                    >
                      <v-btn class="ma-2" outlined color="deep-purple">
                        プロフィール
                      </v-btn>
                    </a>
                    <v-expansion-panels v-model="panel" class="mt-3">
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          ルーム情報
                        </v-expansion-panel-header>
                        <v-expansion-panel-content
                          style="white-space: pre-wrap; word-wrap: break-word"
                        >
                          {{ '\r\n' + userDataJson.room_profile.description }}
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="deep-purple accent-4"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="red accent-4" top>
      {{ errorText }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import constants from '~/constants'

export default {
  name: 'UserProfile',
  data: () => ({
    dialog: false,
    userId: null,
    tab: null,
    panel: null,
    developer: '',
    blockFlg: false,
    userDataJson: null,
    snackbar: false,
    errorText: '',
    timeout: 3000,
    dialogWidth: '60vw',
  }),
  mounted() {
    this.developer = constants.developer
    if (this.$vuetify.breakpoint.name === 'xs') {
      this.dialogWidth = '90vw'
    }
    if (this.$vuetify.breakpoint.name === 'sm') {
      this.dialogWidth = '80vw'
    }
  },
  methods: {
    getUserData(id) {
      this.tab = 0
      this.userId = id
      this.panel = undefined
      this.blockFlg = false

      if (localStorage.block_users) {
        const blockUsers = JSON.parse(localStorage.block_users)
        for (let i = 0; i < blockUsers.length; i++) {
          if (blockUsers[i].account_id === id) {
            this.blockFlg = true
          }
        }
      }

      axios
        .get(`${constants.url.user.profile}${id}`)
        .then((response) => {
          this.userDataJson = response.data
          this.dialog = true
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.errorText = 'このリスナーは退会済みです'
          } else {
            this.errorText = 'エラーが発生しました'
          }
          this.snackbar = true
        })
    },
    userBlock() {
      let blockUsers = []

      if (localStorage.block_users) {
        blockUsers = JSON.parse(localStorage.block_users)
      }

      blockUsers.push({
        account_id: this.userId,
        avatar_url: this.userDataJson.avatar_url,
        name: this.userDataJson.name,
      })

      localStorage.block_users = JSON.stringify(blockUsers)

      this.blockFlg = true
    },
    userUnblock() {
      let blockUsers = []

      if (localStorage.block_users) {
        blockUsers = JSON.parse(localStorage.block_users)
      }

      blockUsers = blockUsers.filter((user) => user.account_id !== this.userId)

      localStorage.block_users = JSON.stringify(blockUsers)

      this.blockFlg = false
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.text-nowrap {
  white-space: nowrap;
}

.pointer {
  cursor: pointer;
}
</style>