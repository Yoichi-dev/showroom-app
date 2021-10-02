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
    let res = await axios.get(env.API_URL + "/api/events/hold");
    return { eventList: res.data };
  },
  head() {
    return {
      title: "HOME",
    };
  },
  mounted() {
    // Twitter Cardのキャッシュが更新されるまでの暫定処理
    window.history.replaceState(null, null, window.location.pathname);
  },
};
</script>
