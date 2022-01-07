<template>
  <v-row justify="center">
    <v-dialog
      v-model="fulldialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>ルーム登録</v-toolbar-title>
        </v-toolbar>
        <v-list three-line subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>ルーム検索</v-list-item-title>
              <v-list-item-subtitle>
                ルームを登録するのでご自身のルーム名を入力して検索してください
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-row class="ml-2">
            <v-col cols="6">
              <v-text-field
                v-model="roomName"
                :rules="nameRules"
                label="ルーム名"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                :disabled="btn"
                @click="searchRoom(roomName)"
              >
                {{ searchText }}
              </v-btn>
            </v-col>
          </v-row>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>検索結果一覧（上位10件まで表示）</v-subheader>

          <v-list-item v-for="(room, index) in searchList" :key="index">
            <v-list-item-action>
              <v-img :src="room.img" alt="" width="100px"></v-img>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                >{{ room.title }}
                <br />
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="addRoom(room.id)"
                >
                  登録
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>読んで！</v-list-item-title>
              <div>
                <br />
                個人製作アプリになります<br />
                <br />
                不具合があるかもしれませんがその時はこっそり教えてください<br />
                たまにコメントが反映されないのはバグではなくSRの仕様です<br />
                （カウント表示はよく間引かれてる）<br />
                <br />
                リスナーの名前をタップするとリスナー情報を見ることができます<br />
                <br />
                一応スマホでも見れますがPC、タブレットでの表示を想定してます
                <br />
                ごくまれにサーバー側のIP制限で使えない人がいますがご了承ください
                <br />
                <br />
                こんな機能欲しいとかあればリクエストしてください
                <br />
                <br />
                <small>
                  デザイン変えたいのでデザイン出来る人手伝ってほしいなー…なんて…
                </small>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: ["fulldialog"],
  data() {
    return {
      searchText: "検索",
      btn: false,
      searchList: [],
      roomName: "",
      nameRules: [(v) => !!v || "入力してください"],
    };
  },
  mounted() {},
  methods: {
    searchRoom(keyword) {
      this.btn = true;
      this.searchText = "検索中...";
      axios
        .get(`${process.env.API_URL}/api/live/search?keyword=${keyword}`)
        .then((response) => {
          // 検索結果
          this.searchList = response.data;
          this.btn = false;
          this.searchText = "検索";
        })
        .catch((err) => {
          alert("存在しません");
          this.btn = false;
          this.searchText = "検索";
        });
    },
    addRoom(roomId) {
      this.roomId = roomId;
      this.$store.commit("setRoomid", roomId);
      this.fulldialog = false;
      location.reload();
    },
  },
};
</script>