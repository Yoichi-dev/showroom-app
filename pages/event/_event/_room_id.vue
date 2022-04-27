<template>
  <div>
    <Info />
    <EndInfo v-if="endFlg" />
    <UserInfo :userInfo="userInfo" />
    <UserData
      :eventHistory="eventHistory"
      :aggregateData="aggregateData"
      :roomId="$route.params.room_id"
      :endFlg="endFlg"
    />
    <ChartGroup
      v-if="!endFlg"
      :pointChartData="todayPointData"
      :followerChartData="todayFollowerData"
      :rankChartData="todayRankData"
      title="本日"
    />
    <ChartGroup
      :pointChartData="dayPointData"
      :followerChartData="dayFollowerData"
      :rankChartData="dayRankData"
      title="日別"
    />
    <ChartGroup
      :pointChartData="allPointData"
      :followerChartData="allFollowerData"
      :rankChartData="allRankData"
      title="全期間"
    />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import constants from "~/constants";

export default {
  async asyncData({ params }) {
    let responseUserInfo = await axios.get(
      `${constants.url.domain}${constants.url.room.profile}${params.room_id}`
    );
    let userInfo = responseUserInfo.data;
    let responseEventHistory = await axios.get(
      `${constants.url.domain}${constants.url.history.search}${params.event}/${params.room_id}`
    );
    let eventHistory = responseEventHistory.data;
    let responseAggregateData = await axios.get(
      `${constants.url.domain}${constants.url.history.aggregate}${params.event}`
    );
    let aggregateData = responseAggregateData.data;
    let responseEventInfo = await axios.get(
      `${constants.url.domain}${constants.url.event.info}${params.event}`
    );
    let endFlg =
      responseEventInfo.data[0].ended_at <
      Math.round(new Date().getTime() / 1000);
    return { userInfo, eventHistory, aggregateData, endFlg };
  },
  data() {
    return {
      todayPointList: [],
      todayPointData: {},
      todayFollowerData: {},
      todayRankData: {},
      dayPointData: {},
      dayFollowerData: {},
      dayRankData: {},
      allPointData: {},
      allFollowerData: {},
      allRankData: {},
    };
  },
  head() {
    return {
      title: this.userInfo.room_name + "の配信情報",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.userInfo.room_name + "の配信情報",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.userInfo.room_name,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.userInfo.room_name + "の配信情報",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.userInfo.image
            .replace("_m.png", "_l.png")
            .replace("_m.jpeg", "_l.jpeg"),
        },
      ],
    };
  },
  mounted() {
    // 初期化
    this.todayPointData = {
      labels: [],
      datasets: [],
    };
    this.todayFollowerData = {
      labels: [],
      datasets: [],
    };
    this.todayRankData = {
      labels: [],
      datasets: [],
    };
    this.dayPointData = {
      labels: [],
      datasets: [],
    };
    this.dayFollowerData = {
      labels: [],
      datasets: [],
    };
    this.dayRankData = {
      labels: [],
      datasets: [],
    };
    this.allPointData = {
      labels: [],
      datasets: [],
    };
    this.allFollowerData = {
      labels: [],
      datasets: [],
    };
    this.allRankData = {
      labels: [],
      datasets: [],
    };
    this.createChart();
  },
  methods: {
    createChart() {
      let nowDate = new Date();
      let today = new Date(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        0,
        0,
        0
      );
      let todayUnixTime = Math.floor(today.getTime() / 1000);
      let todayEndUnixTime = todayUnixTime + 86399;
      // 今日分だけ取得
      let todayData = [];
      this.eventHistory.forEach((user, index) => {
        if (todayUnixTime <= user.get_at && user.get_at <= todayEndUnixTime) {
          todayData.push(user);
        }
      });
      if (todayData.length == 0) {
        this.todayFlg = false;
      }
      // グラフの色
      let color = { r: 0, g: 0, b: 0 };
      for (let c in color) {
        color[c] = Math.floor(Math.random() * 256);
      }
      // 今日のチャート
      this.todayChart(this.userInfo.room_name, todayData, color, 0);
      // 日別のチャート
      this.dayChart(this.userInfo.room_name, this.eventHistory, color, 0);
      // 全期間のチャート
      this.allChart(this.userInfo.room_name, this.eventHistory, color, 0);
    },
    todayChart(room_name, todayData, color, index) {
      // 本日分ポイントグラフ作成
      this.todayPointData.datasets.push({
        tension: 0,
        label: room_name,
        data: todayData.map((e) => e.point),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 本日分フォロワーグラフ作成
      this.todayFollowerData.datasets.push({
        tension: 0,
        label: room_name,
        data: todayData.map((e) => e.follower_num),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 本日分順位グラフ作成
      this.todayRankData.datasets.push({
        tension: 0,
        label: room_name,
        data: todayData.map((e) => e.rank),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // ラベル作成
      if (index === 0) {
        // 本日分ラベル設定
        todayData.forEach((v) => {
          this.todayPointData.labels.push(this.formatDateTime(v.get_at));
          this.todayFollowerData.labels.push(this.formatDateTime(v.get_at));
          this.todayRankData.labels.push(this.formatDateTime(v.get_at));
        });
      }
    },
    dayChart(room_name, userData, color, index) {
      let dayPoint = userData[0].point;
      let dayFollower = userData[0].follower_num;
      let dayRank = userData[0].rank;
      let dayLabel = this.formatMdDate(userData[0].get_at);
      let dayFlg = this.formatDay(userData[0].get_at);
      let dayPointList = [];
      let dayFollowerList = [];
      let dayRankList = [];
      let dayLabelList = [];
      userData.map((v, idx) => {
        if (dayFlg != this.formatDay(v.get_at)) {
          dayPointList.push(dayPoint);
          dayFollowerList.push(dayFollower);
          dayRankList.push(dayRank);
          dayLabelList.push(dayLabel);
          dayFlg = this.formatDay(v.get_at);
        }
        dayPoint = v.point;
        dayFollower = v.follower_num;
        dayRank = v.rank;
        dayLabel = this.formatMdDate(v.get_at);
        if (userData.length - 1 == idx) {
          dayPointList.push(dayPoint);
          dayFollowerList.push(dayFollower);
          dayRankList.push(dayRank);
          dayLabelList.push(dayLabel);
        }
      });
      this.todayPointList = dayPointList;
      // 日別ポイントグラフ作成
      this.dayPointData.datasets.push({
        tension: 0,
        label: room_name,
        data: dayPointList,
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 日別フォロワーグラフ作成
      this.dayFollowerData.datasets.push({
        tension: 0,
        label: room_name,
        data: dayFollowerList,
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 日別順位グラフ作成
      this.dayRankData.datasets.push({
        tension: 0,
        label: room_name,
        data: dayRankList,
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // ラベル作成
      if (index === 0) {
        // 日別ラベル設定
        dayLabelList.map((e) => {
          this.dayPointData.labels.push(e);
          this.dayFollowerData.labels.push(e);
          this.dayRankData.labels.push(e);
        });
      }
    },
    allChart(room_name, userData, color, index) {
      // 全期間ポイントグラフ作成
      this.allPointData.datasets.push({
        tension: 0,
        label: room_name,
        data: userData.map((e) => e.point),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 全期間フォロワー作成
      this.allFollowerData.datasets.push({
        tension: 0,
        label: room_name,
        data: userData.map((e) => e.follower_num),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // 全期間順位グラフ作成
      this.allRankData.datasets.push({
        tension: 0,
        label: room_name,
        data: userData.map((e) => e.rank),
        backgroundColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0)",
        borderColor:
          "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)",
      });
      // ラベル作成
      if (index === 0) {
        // 全期間ポイントラベル設定
        userData.forEach((v) => {
          this.allPointData.labels.push(this.formatDate(v.get_at));
          this.allFollowerData.labels.push(this.formatDate(v.get_at));
          this.allRankData.labels.push(this.formatDate(v.get_at));
        });
      }
    },
    formatDate(inputDate) {
      return moment.unix(inputDate).format("MM/DD HH:mm");
    },
    formatMdDate(inputDate) {
      return moment.unix(inputDate).format("MM/DD");
    },
    formatDateTime(inputDate) {
      return moment.unix(inputDate).format("HH時");
    },
    formatDay(inputDate) {
      return moment.unix(inputDate).format("DD");
    },
  },
};
</script>
