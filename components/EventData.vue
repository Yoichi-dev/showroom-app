<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      lg="3"
      xl="3"
      v-for="(item, index) in avgData"
      :key="index"
    >
      <v-card class="mx-auto" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">{{ item.title }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ item.value }}
            </v-list-item-title>
          </v-list-item-content>
          <v-icon size="80" color="green">
            {{ item.icon }}
          </v-icon>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  props: ["eventInfo", "eventData"],
  data() {
    return {
      avgData: [
        {
          title: "イベント内平均ポイント",
          icon: "mdi-file-powerpoint-box-outline",
          value: "",
        },
        {
          title: "平均フォロワー",
          icon: "mdi-account-multiple-plus",
          value: "",
        },
        {
          title: "イベント期間",
          icon: "mdi-calendar-month",
          value: "",
        },
        {
          title: "参加人数",
          icon: "mdi-account-group",
          value: "",
        },
      ],
    };
  },
  mounted() {
    // イベント平均ポイント
    this.avgData[0].value = `${this.formatNum(
      this.getAvg(this.eventData.map((val) => val.point))
    )}pt`;
    // イベント平均フォロワー
    this.avgData[1].value = `${this.formatNum(
      this.getAvg(this.eventData.map((val) => val.follower_num))
    )}人`;
    // イベント期間
    let startDate = new Date(this.eventInfo.started_at * 1000);
    let endDate = new Date(this.eventInfo.ended_at * 1000);
    // イベント期間
    this.avgData[2].value = `${
      Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    }日間`;
    // イベント参加人数
    this.avgData[3].value = `${this.eventData.length}人`;
  },
  methods: {
    getAvg(data) {
      let sum = data.reduce((acc, cur) => {
        return acc + cur;
      });
      return Math.round(sum / data.length);
    },
    formatNum(data) {
      return data.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
    formatYmdDate(inputDate) {
      return moment.unix(inputDate).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>