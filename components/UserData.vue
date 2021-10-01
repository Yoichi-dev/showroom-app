<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      lg="3"
      xl="3"
      v-for="(item, index) in avgData"
      :key="index"
      v-if="item.show"
    >
      <v-card class="mx-auto" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">{{ item.title }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ item.value }}
              <small v-if="item.title === '順位'">
                / {{ aggregateData.length }}位中
              </small>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.sub }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-icon size="80" :color="item.color">
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
  props: ["roomId", "eventHistory", "aggregateData", "endFlg"],
  data() {
    return {
      avgData: [
        {
          title: "順位",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
        {
          title: "トータルポイント",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
        {
          title: "本日のポイント",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
        {
          title: "フォロワー数",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
        {
          title: "イベント内平均ポイント",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
        {
          title: "イベント内平均フォロワー",
          icon: "",
          value: "",
          sub: "",
          color: "green",
          show: true,
        },
      ],
      todayPointList: null,
    };
  },
  mounted() {
    // イベント平均ポイント
    this.avgData[4].value = `${this.formatNum(
      this.getAvg(this.aggregateData.map((val) => val.point))
    )}pt`;
    // イベント平均フォロワー
    this.avgData[5].value = `${this.formatNum(
      this.getAvg(this.aggregateData.map((val) => val.follower_num))
    )}人`;
    let userData = this.aggregateData.filter(
      (val) => val.room_id === this.roomId
    )[0];
    // 順位
    this.avgData[0].value = `${userData.rank}位`;
    this.avgData[0].sub = `前回集計時の順位 ${
      this.eventHistory[this.eventHistory.length - 2].rank
    }位`;
    if (
      userData.rank === this.eventHistory[this.eventHistory.length - 2].rank
    ) {
      this.avgData[0].icon = "mdi-trending-neutral";
      this.avgData[0].color = "blue";
    } else if (
      userData.rank < this.eventHistory[this.eventHistory.length - 2].rank
    ) {
      this.avgData[0].icon = "mdi-trending-up";
    } else {
      this.avgData[0].icon = "mdi-trending-down";
      this.avgData[0].color = "red";
    }
    // 平均ポイントアイコン
    if (
      userData.point >= this.getAvg(this.aggregateData.map((val) => val.point))
    ) {
      this.avgData[4].icon = "mdi-arrow-up-circle-outline";
    } else {
      this.avgData[4].icon = "mdi-arrow-down-circle-outline";
      this.avgData[4].color = "red";
    }
    // 平均フォロワーアイコン
    if (
      this.eventHistory[this.eventHistory.length - 1].follower_num >=
      this.getAvg(this.aggregateData.map((val) => val.follower_num))
    ) {
      this.avgData[5].icon = "mdi-arrow-up-circle-outline";
    } else {
      this.avgData[5].icon = "mdi-arrow-down-circle-outline";
      this.avgData[5].color = "red";
    }
    // トータルポイント
    this.avgData[1].value = `${this.formatNum(userData.point)}pt`;
    if (userData.rank === 1) {
      this.avgData[1].sub = `2位との差 ${this.formatNum(userData.gap)}pt`;
      this.avgData[1].icon = "mdi-crown";
    } else {
      this.avgData[1].sub = `次の順位との差 ${this.formatNum(userData.gap)}pt`;
      this.avgData[1].icon = "mdi-file-powerpoint-box-outline";
    }
    // 今日分だけ取得
    this.dayChart(this.eventHistory);
    // 本日のポイント
    if (this.todayPointList.length === 1) {
      this.avgData[2].value = `${this.formatNum(this.todayPointList[0])}pt`;
    } else if (this.todayPointList.length === 2) {
      this.avgData[2].value = `${this.formatNum(
        this.todayPointList[1] - this.todayPointList[0]
      )}pt`;
    } else {
      this.avgData[2].value = `${this.formatNum(
        this.todayPointList[this.todayPointList.length - 1] -
          this.todayPointList[this.todayPointList.length - 2]
      )}pt`;
    }
    let ratio = 0;
    // 前日比
    if (this.todayPointList.length === 1) {
      ratio = 100;
    } else {
      if (this.todayPointList.length > 3) {
        ratio = Math.round(
          ((this.todayPointList[this.todayPointList.length - 1] -
            this.todayPointList[this.todayPointList.length - 2]) /
            (this.todayPointList[this.todayPointList.length - 2] -
              this.todayPointList[this.todayPointList.length - 3])) *
            100
        );
      } else {
        ratio = Math.round(
          ((this.todayPointList[this.todayPointList.length - 1] -
            this.todayPointList[this.todayPointList.length - 2]) /
            this.todayPointList[this.todayPointList.length - 2]) *
            100
        );
      }
    }
    this.avgData[2].sub = `前日比 ${
      isNaN(this.formatNum(ratio))
        ? 0
        : isFinite(ratio)
        ? this.formatNum(ratio)
        : "(測定不能)"
    }%`;
    if (ratio >= 100) {
      this.avgData[2].icon = "mdi-trending-up";
    } else {
      this.avgData[2].icon = "mdi-trending-down";
      this.avgData[2].color = "red";
    }
    // フォロワー数
    this.avgData[3].value = `${this.formatNum(
      this.eventHistory[this.eventHistory.length - 1].follower_num
    )}人`;
    let followerNum =
      this.eventHistory[this.eventHistory.length - 1].follower_num -
      this.eventHistory[this.eventHistory.length - 2].follower_num;
    if (followerNum === 0) {
      this.avgData[3].sub = "フォロワー変動なし";
      this.avgData[3].icon = "mdi-trending-neutral";
      this.avgData[3].color = "blue";
    } else if (followerNum > 0) {
      this.avgData[3].sub = `前回集計時より ${followerNum}人増加`;
      this.avgData[3].icon = "mdi-trending-up";
    } else {
      this.avgData[3].sub = `前回集計時より ${-followerNum}人減少`;
      this.avgData[3].icon = "mdi-trending-down";
      this.avgData[3].color = "red";
    }
    if (this.endFlg) {
      this.avgData[2].show = false;
      this.avgData[3].show = false;
    }
  },
  methods: {
    getAggregate() {
      // 平均ポイント
      let pointList = this.aggregateData.map((val) => val.point);
      let sumPoint = pointList.reduce((acc, cur) => {
        return acc + cur;
      });
      // 平均フォロワー
      let followerList = this.aggregateData.map((val) => val.follower_num);
      let sumFollower = followerList.reduce((acc, cur) => {
        return acc + cur;
      });
      this.avgPoint = Math.round(sumPoint / this.aggregateData.length);
      this.avgFollower = Math.round(sumFollower / this.aggregateData.length);
      this.totalPoint = this.eventHistory[this.eventHistory.length - 1].point;
    },
    dayChart(userData) {
      let dayPoint = userData[0].point;
      let dayFlg = this.formatDay(userData[0].get_at);
      let dayPointList = [];
      userData.map((v, idx) => {
        if (dayFlg != this.formatDay(v.get_at)) {
          dayPointList.push(dayPoint);
          dayFlg = this.formatDay(v.get_at);
        }
        dayPoint = v.point;
        if (userData.length - 1 == idx) {
          dayPointList.push(dayPoint);
        }
      });
      this.todayPointList = dayPointList;
    },
    getAvg(data) {
      let sum = data.reduce((acc, cur) => {
        return acc + cur;
      });
      return Math.round(sum / data.length);
    },
    formatNum(data) {
      return data.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
    formatDay(inputDate) {
      return moment.unix(inputDate).format("DD");
    },
  },
};
</script>