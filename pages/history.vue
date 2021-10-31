<template>
  <div class="mt-1">
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">日付</th>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in logList" :key="index">
                <td>{{ formatYmdDate(item.day) }} の配信ログ</td>
                <td>
                  <v-btn
                    outlined
                    rounded
                    text
                    color="teal"
                    @click="$router.push('/?id=' + index)"
                  >
                    表示
                  </v-btn>
                </td>

                <td>
                  <VueJsonToCsv
                    :json-data="csvData"
                    :csv-title="csvTitle"
                    :labels="csvLabels"
                    v-if="logList[index].comment.length != 0"
                  >
                    <v-btn
                      outlined
                      rounded
                      text
                      color="green"
                      @click="downloadComment(index)"
                    >
                      コメントDL
                    </v-btn>
                  </VueJsonToCsv>
                </td>
                <td>
                  <VueJsonToCsv
                    :json-data="csvData"
                    :csv-title="csvTitle"
                    :labels="csvLabels"
                    v-if="logList[index].free.length != 0"
                  >
                    <v-btn
                      outlined
                      rounded
                      text
                      color="green"
                      @click="downloadFree(index)"
                    >
                      無料ギフトDL
                    </v-btn>
                  </VueJsonToCsv>
                </td>
                <td>
                  <VueJsonToCsv
                    :json-data="csvData"
                    :csv-title="csvTitle"
                    :labels="csvLabels"
                    v-if="logList[index].pre.length != 0"
                  >
                    <v-btn
                      outlined
                      rounded
                      text
                      color="green"
                      @click="downloadPre(index)"
                    >
                      有料ギフトDL
                    </v-btn>
                  </VueJsonToCsv>
                </td>
                <td>
                  <VueJsonToCsv
                    :json-data="csvData"
                    :csv-title="csvTitle"
                    :labels="csvLabels"
                    v-if="logList[index].count.length != 0"
                  >
                    <v-btn
                      outlined
                      rounded
                      text
                      color="green"
                      @click="downloadCount(index)"
                    >
                      カウントDL
                    </v-btn>
                  </VueJsonToCsv>
                </td>
                <td>
                  <VueJsonToCsv
                    :json-data="csvData"
                    :csv-title="csvTitle"
                    :labels="csvLabels"
                    v-if="logList[index].ranking.length != 0"
                  >
                    <v-btn
                      outlined
                      rounded
                      text
                      color="green"
                      @click="downloadRank(index)"
                    >
                      ランキングDL
                    </v-btn>
                  </VueJsonToCsv>
                </td>
                <td>
                  <v-btn
                    outlined
                    rounded
                    text
                    color="red"
                    @click="deleteLog(index)"
                  >
                    削除
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import VueJsonToCsv from "vue-json-to-csv";

export default {
  components: {
    VueJsonToCsv,
  },
  data() {
    return {
      title: "配信ログ履歴",
      roomId: null,
      logList: null,
      csvData: [],
      csvTitle: "",
      csvLabels: null,
      useGiftList: [],
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  mounted() {
    // 読み込み
    setTimeout(() => {
      if (this.$store.state.roomid === null) {
        this.$router.push("/");
      }
      if (this.$store.state.streaminglog === null) {
        this.$router.push("/");
      }
      this.logList = this.$store.state.streaminglog;
      // 使えるギフトリスト取得
      axios
        .get(
          `${process.env.API_URL}/api/live/giftlist/${this.$store.state.roomid}`
        )
        .then((response) => {
          this.useGiftList = response.data.normal;
        });
    }, 0);
  },
  methods: {
    downloadComment(id) {
      this.csvData = [];
      this.csvLabels = {
        id: { title: "ユーザーID" },
        name: { title: "名前" },
        comment: { title: "コメント" },
      };
      this.csvTitle =
        "【コメントリスト】" + this.formatYmdDate(this.logList[id].day);
      this.logList[id].comment.forEach((data) => {
        this.csvData.push({
          id: data.id,
          name: data.name,
          comment: data.comment,
        });
      });
    },
    downloadFree(id) {
      this.csvData = [];
      this.csvLabels = {
        id: { title: "ユーザーID" },
        name: { title: "名前" },
        point: { title: "ポイント" },
      };
      this.csvTitle =
        "【無料ギフトリスト】" + this.formatYmdDate(this.logList[id].day);
      this.logList[id].free.forEach((data) => {
        this.csvData.push({
          id: data.id,
          name: data.name,
          point: data.num,
        });
      });
    },
    downloadPre(id) {
      this.csvData = [];
      this.csvLabels = {
        id: { title: "ユーザーID" },
        name: { title: "名前" },
        gift: { title: "ギフト名" },
        num: { title: "数" },
      };
      this.csvTitle =
        "【有料ギフトリスト】" + this.formatYmdDate(this.logList[id].day);
      this.logList[id].pre.forEach((data) => {
        this.csvData.push({
          id: data.id,
          name: data.name,
          gift: this.useGiftList.find((e) => e.gift_id === data.gitId)
            .gift_name,
          num: data.num,
        });
      });
    },
    downloadCount(id) {
      this.csvData = [];
      this.csvLabels = {
        id: { title: "ユーザーID" },
        name: { title: "名前" },
      };
      this.csvTitle =
        "【カウントリスト】" + this.formatYmdDate(this.logList[id].day);
      this.logList[id].count.forEach((data) => {
        this.csvData.push({
          id: data.id,
          name: data.name,
        });
      });
    },
    downloadRank(id) {
      this.csvData = [];
      this.csvLabels = {
        id: { title: "ユーザーID" },
        name: { title: "名前" },
        rank: { title: "順位" },
      };
      this.csvTitle =
        "【配信内ランキング】" + this.formatYmdDate(this.logList[id].day);
      this.logList[id].ranking.forEach((data) => {
        this.csvData.push({
          id: data.user.user_id,
          name: data.user.name,
          rank: data.rank,
        });
      });
    },
    formatYmdDate(inputDate) {
      return moment.unix(inputDate).format("YYYY/MM/DD HH:mm");
    },
    deleteLog(id) {
      let result = confirm("配信ログを削除しますか？");
      if (result) {
        let newLogList = this.logList.filter((ele, index) => index !== id);
        this.logList = newLogList;
        this.$store.commit("setStreaminglog", this.logList);
      }
    },
  },
};
</script>