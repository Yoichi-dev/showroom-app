<template>
  <div>
    <Info />
    <Event :eventList="eventList" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  async asyncData({ env }) {
    let res = await axios.get(env.API_URL + "/api/events/end");
    return { eventList: res.data };
  },
  head() {
    return {
      title: "終了済イベント一覧",
    };
  },
};
</script>
