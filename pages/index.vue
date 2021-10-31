<template>
  <div class="mt-1">
    <search :fulldialog.sync="fulldialog" />
    <v-row justify="center" align="center" v-if="showBtn">
      <v-btn class="ma-2" outlined color="indigo" @click="checkLive()">
        ルームに接続
      </v-btn>
      <v-btn class="ma-2" outlined color="red" @click="deleteData()">
        初期化
      </v-btn>
    </v-row>
    <v-row justify="center" align="center" v-if="logFlg">
      <v-btn
        class="ma-2"
        outlined
        color="green"
        @click="$router.push('/history')"
      >
        過去のログを確認
      </v-btn>
    </v-row>
    <!-- 基本情報 -->
    <info :infoData="infoData" />
    <v-row>
      <v-col cols="12" sm="6">
        <!-- テロップ -->
        <Telop :telop="telop" />
        <!-- コメント -->
        <Comment
          :commentList="commentList"
          :developerId="developerId"
          :styleSetting="styleSetting.comentSize"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12" lg="6">
            <!-- 無料ギフト -->
            <Gift
              :gifts="freeGiftList"
              :developerId="developerId"
              :styleSetting="styleSetting.giftSize"
            />
            <!-- 有料ギフト -->
            <Gift
              :gifts="preGiftList"
              :developerId="developerId"
              :styleSetting="styleSetting.giftSize"
            />
            <!-- カウント -->
            <Count
              :countList="countList"
              :developerId="developerId"
              :styleSetting="styleSetting.giftSize"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <!-- ランキング -->
            <Ranking
              :rankingList="rankingList"
              :developerId="developerId"
              :styleSetting="styleSetting.rankingSize"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "HOME",
      developerId: 3699368,
      roomId: null,
      socket: null,
      infoData: [
        {
          title: "獲得ポイント",
          num: 0,
          icon: "mdi-file-powerpoint-box-outline",
        },
        {
          title: "現在のフォロワー数",
          num: 0,
          icon: "mdi-account-multiple-plus",
        },
        {
          title: "来場者数",
          num: 0,
          icon: "mdi-account-group",
        },
        {
          title: "配信開始時間",
          liveStartDate: "",
          icon: "mdi-clock-outline",
        },
      ],
      telop: null,
      streamData: null,
      commentList: [],
      useGiftList: [],
      freeGiftList: [],
      preGiftList: [],
      countList: [],
      rankingList: [],
      totalPoint: 0,
      showBtn: true,
      checkPing: null,
      fulldialog: true,
      styleSetting: {
        commentSize: "",
        giftSize: "",
        rankingSize: "",
      },
      logFlg: false,
      logList: [],
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  mounted() {
    switch (this.$vuetify.breakpoint.name) {
      case "xs":
        this.styleSetting.giftSize = "30vh";
        this.styleSetting.comentSize = "50vh";
        this.styleSetting.rankingSize = "50vh";
        break;
      case "sm":
        this.styleSetting.giftSize = "20vh";
        this.styleSetting.comentSize = "110vh";
        this.styleSetting.rankingSize = "50vh";
        break;
      case "md":
        this.styleSetting.giftSize = "20vh";
        this.styleSetting.comentSize = "130vh";
        this.styleSetting.rankingSize = "70vh";
        break;
      case "lg":
        this.styleSetting.giftSize = "20vh";
        this.styleSetting.comentSize = "50vh";
        this.styleSetting.rankingSize = "60vh";
        break;
      case "xl":
        this.styleSetting.giftSize = "20vh";
        this.styleSetting.comentSize = "68vh";
        this.styleSetting.rankingSize = "70vh";
        break;
    }
    // ルームID読み込み
    setTimeout(() => {
      if (this.$store.state.roomid === null) {
        this.fulldialog = true;
      } else {
        this.fulldialog = false;
        this.roomId = this.$store.state.roomid;
      }
      if (this.$store.state.streaminglog != null) {
        this.logFlg = true;
        this.logList = this.$store.state.streaminglog;
        if (
          this.$route.query.id != undefined &&
          0 <= this.$route.query.id &&
          this.$route.query.id <= this.logList.length
        ) {
          this.commentList = this.logList[this.$route.query.id].comment;
          this.freeGiftList = this.logList[this.$route.query.id].free;
          this.preGiftList = this.logList[this.$route.query.id].pre;
          this.countList = this.logList[this.$route.query.id].count;
          this.rankingList = this.logList[this.$route.query.id].ranking;
          this.infoData = this.logList[this.$route.query.id].info;
        }
      }
    }, 0);
    // サブAPIの起動
    axios.get(process.env.API_SUB_URL);
  },
  methods: {
    async checkLive() {
      window.history.replaceState(null, null, window.location.pathname);
      // 初期化
      this.clearData();
      // 配信しているか確認
      let responseData = await this.getApi(
        `${process.env.API_URL}/api/users/${this.roomId}`
      );
      // Error or Onlive or Premium
      if (
        responseData.status != 200 ||
        !responseData.data.is_onlive ||
        responseData.data.premium_room_type === 1
      ) {
        alert("配信停止中です");
        return;
      }
      // ボタン非表示
      this.showBtn = false;
      // 開始時間
      this.infoData[3].liveStartDate =
        responseData.data.current_live_started_at;
      // 総視聴者
      this.infoData[2].num = responseData.data.view_num;
      // フォロワー
      this.infoData[1].num = responseData.data.follower_num;
      // テロップ取得
      let responseTelop = await this.getApi(
        `${process.env.API_URL}/api/live/telop/${this.roomId}`
      );
      this.telop = responseTelop.data.telop;
      // ライブランキング取得
      let responseRanking = await this.getApi(
        `${process.env.API_URL}/api/live/ranking/${this.roomId}`
      );
      this.rankingList = responseRanking.data.stage_user_list;
      // 使えるギフトリスト取得
      let responseUseGift = await this.getApi(
        `${process.env.API_URL}/api/live/giftlist/${this.roomId}`
      );
      this.useGiftList = responseUseGift.data.normal;
      // 配信情報取得
      let responseLiveData = await this.getApi(
        `${process.env.API_URL}/api/users/live/${this.roomId}`
      );
      this.streamData = responseLiveData.data;
      this.title = responseLiveData.data.room_name;
      // 接続
      this.socketSetting(responseLiveData.data.bcsvr_key);
    },
    getApi(url) {
      return axios.get(url);
    },
    socketSetting(bcsvrKey) {
      // 接続
      this.socket = new WebSocket("wss://online.showroom-live.com");
      // 接続確認
      this.socket.onopen = (e) => {
        this.socket.send(`SUB\t${bcsvrKey}`);
      };
      // エラー発生時
      this.socket.onerror = (error) => {
        alert("エラーが発生しました\nページをリロードします");
        this.socket.close();
        clearInterval(this.checkPing);
        location.reload();
        return;
      };
      // 疎通確認
      this.checkPing = setInterval(() => {
        this.socket.send("PING\tshowroom");
        this.update();
      }, 60000);
      // メッセージ受信
      this.socket.onmessage = (data) => {
        // 死活監視
        if (data.data === "ACK\tshowroom") {
          return;
        }
        // エラー
        if (data.data === "ERR") {
          alert("エラーが発生しました\nページをリロードします");
          this.socket.close();
          clearInterval(this.checkPing);
          location.reload();
          return;
        }
        // JSON変換
        let getJson = JSON.parse(data.data.split(`MSG\t${bcsvrKey}`)[1]);
        // 処理分岐
        if (Object.keys(getJson).length === 9) {
          // コメントログ
          this.commentProcess(getJson);
        } else if (Object.keys(getJson).length === 12) {
          // ギフトログ
          this.giftProcess(getJson);
        } else if (Object.keys(getJson).length === 5) {
          // テロップ
          this.telopProcess(getJson);
        } else if (Object.keys(getJson).length === 4 && getJson.t == 101) {
          this.socket.close();
          clearInterval(this.checkPing);
          let result = confirm(
            "配信が終了しました\n\n今回の配信ログを見返せるように保存しますか？"
          );
          if (result) {
            this.logList.push({
              day: Math.floor(new Date().getTime() / 1000),
              comment: this.commentList,
              free: this.freeGiftList,
              pre: this.preGiftList,
              count: this.countList,
              ranking: this.rankingList,
              info: this.infoData,
            });
            this.$store.commit("setStreaminglog", this.logList);
          }
        }
      };
    },
    commentProcess(commentObj) {
      // 自動投稿空白対策
      if (commentObj.cm === undefined) {
        return;
      }
      // 全角数字を半角に変換
      let numberFormat = commentObj.cm.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });

      if (!isNaN(numberFormat) && Number(numberFormat) <= 50) {
        // カウント
        this.addCount(commentObj);
      } else {
        // コメント
        this.addComment(commentObj);
      }
    },
    giftProcess(giftObj) {
      // ギフトログ
      if (giftObj.gt == 2) {
        // 投票
        if (Number(giftObj.g) > 10000 && Number(giftObj.g) <= 10070) {
        } else if (giftObj.g == 1601) {
          // 虹星
          this.addPreGift(giftObj);
        } else {
          // 無料
          this.addFreeGift(giftObj);
        }
      } else {
        // 有料
        this.addPreGift(giftObj);
      }
    },
    telopProcess(socketTelop) {
      this.telop = socketTelop.telop;
    },
    addCount(countObj) {
      // 既に存在するか確認
      if (this.countList.some((e) => e.id == countObj.u)) {
        for (let i in this.countList) {
          if (this.countList[i].id === countObj.u) {
            this.countList[i].num = countObj.cm;
            this.countList[i].name = countObj.ac;
            this.countList[i].avatar = countObj.av;
            // 全角の場合
            if (countObj.cm == "50" && !this.countList[i].pointFlg) {
              this.countList[i].pointFlg = true;
              this.totalPoint += 50;
            }
          }
        }
        // TODO
        let countData = null;

        this.countList.some((val, i) => {
          if (val.id == countObj.u) {
            countData = val;
            this.countList.splice(i, 1);
          }
        });

        // 先頭に追加
        this.countList.unshift(countData);
      } else {
        // 新規追加
        this.countList.unshift({
          id: countObj.u,
          name: countObj.ac,
          num: countObj.cm,
          flg: countObj.ua,
          avatar: countObj.av,
          pointFlg: false,
        });
      }
    },
    addComment(commentObj) {
      this.commentList.unshift({
        id: commentObj.u,
        name: commentObj.ac,
        comment: commentObj.cm,
        flg: commentObj.ua,
        avatar: commentObj.av,
      });
    },
    addPreGift(giftObj) {
      // 使えるギフトのポイントを検索
      let useGiftPoint = this.useGiftList.find((e) => e.gift_id === giftObj.g);
      // 一覧にあれば加算対象
      if (useGiftPoint != undefined) {
        // 10連
        if (giftObj.n == 10) {
          this.infoData[0].num += Math.floor(
            useGiftPoint.point * giftObj.n * 2.5 * 1.25
          );
        } else {
          this.infoData[0].num += Math.floor(
            useGiftPoint.point * giftObj.n * 2.5
          );
        }
      }
      // 既に存在するか確認
      if (
        this.preGiftList.some(
          (e) => e.id === giftObj.u && e.gitId === giftObj.g
        )
      ) {
        for (let i in this.preGiftList) {
          if (
            this.preGiftList[i].id === giftObj.u &&
            this.preGiftList[i].gitId === giftObj.g
          ) {
            this.preGiftList[i].num += giftObj.n;
            this.preGiftList[i].name = giftObj.ac;
            this.preGiftList[i].avatar = giftObj.av;
          }
        }
        let preGiftData = null;
        this.preGiftList.some((val, i) => {
          if (val.id === giftObj.u && val.gitId === giftObj.g) {
            preGiftData = val;
            this.preGiftList.splice(i, 1);
          }
        });
        this.preGiftList.unshift(preGiftData);
      } else {
        this.preGiftList.unshift({
          id: giftObj.u,
          name: giftObj.ac,
          gitId: giftObj.g,
          num: giftObj.n,
          flg: giftObj.ua,
          avatar: giftObj.av,
        });
      }
    },
    addFreeGift(giftObj) {
      // 10連
      if (giftObj.n == 10) {
        this.infoData[0].num += Math.floor(giftObj.n * 1.25);
      } else {
        this.infoData[0].num += giftObj.n;
      }

      // 既に存在するか確認
      if (this.freeGiftList.some((e) => e.id == giftObj.u)) {
        for (let i in this.freeGiftList) {
          if (this.freeGiftList[i].id === giftObj.u) {
            this.freeGiftList[i].num += giftObj.n;
            this.freeGiftList[i].gitId = giftObj.g;
            this.freeGiftList[i].name = giftObj.ac;
            this.freeGiftList[i].avatar = giftObj.av;
          }
        }
        // TODO
        let freeGiftData = null;

        this.freeGiftList.some((val, i) => {
          if (val.id == giftObj.u) {
            freeGiftData = val;
            this.freeGiftList.splice(i, 1);
          }
        });

        // 先頭に追加
        this.freeGiftList.unshift(freeGiftData);
      } else {
        this.freeGiftList.unshift({
          id: giftObj.u,
          name: giftObj.ac,
          gitId: giftObj.g,
          num: giftObj.n,
          flg: giftObj.ua,
          avatar: giftObj.av,
        });
      }
    },
    update() {
      // 視聴者・フォロワー
      axios
        .get(`${process.env.API_SUB_URL}/api/users/${this.roomId}`)
        .then((response) => {
          // フォロワー
          this.infoData[1].num = response.data.follower_num;
          if (response.data.is_onlive) {
            // 総視聴者
            this.infoData[2].num = response.data.view_num;
          }
        });
      // ライブランキング
      axios
        .get(`${process.env.API_SUB_URL}/api/live/ranking/${this.roomId}`)
        .then((response) => {
          this.rankingList = response.data.stage_user_list;
        });
    },
    deleteData() {
      let result = window.confirm(
        "初期化しますか？\nルーム情報、今までのログが削除されます"
      );
      if (result) {
        this.$store.commit("setRoomid", null);
        this.$store.commit("setStreaminglog", null);
        location.reload();
      }
    },
    clearData() {
      this.commentList = [];
      this.freeGiftList = [];
      this.preGiftList = [];
      this.countList = [];
      this.rankingList = [];
      this.infoData = [
        {
          title: "獲得ポイント",
          num: 0,
          icon: "mdi-file-powerpoint-box-outline",
        },
        {
          title: "現在のフォロワー数",
          num: 0,
          icon: "mdi-account-multiple-plus",
        },
        {
          title: "来場者数",
          num: 0,
          icon: "mdi-account-group",
        },
        {
          title: "配信開始時間",
          liveStartDate: "",
          icon: "mdi-clock-outline",
        },
      ];
    },
  },
};
</script>