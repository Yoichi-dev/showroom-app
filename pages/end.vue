<template>
  <div>
    <Info />
    <Event :eventList="eventList" :endFlg="true" />
    <span v-if="eventList.length === 0">
      登録されているイベントがありません
    </span>
  </div>
</template>

<script>
// import axios from "axios";
// import constants from "~/constants";

export default {
  // async asyncData() {
  //   let res = await axios.get(constants.url.domain + constants.url.event.end);
  //   return { eventList: res.data };
  // },
  head() {
    return {
      title: "終了済イベント一覧",
    };
  },
  data() {
    return {
      eventList: [],
    };
  },
};
</script>
