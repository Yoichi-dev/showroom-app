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
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "SHOWROOMイベントのポイント遷移が確認できる個人制作Webアプリになります",
        },
        {
          hid: "twitter:creator",
          property: "twitter:creator",
          content: "@yoichiro_sub",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Point History",
        },
        {
          hid: "og:description",
          property: "og:description",
          content:
            "SHOWROOMイベントのポイント遷移が確認できる個人制作Webアプリになります",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: require("@/assets/img/top.png"),
        },
        {
          hid: "twitter:card",
          property: "twitter:card",
          content: "summary_large_image",
        },
      ],
    };
  },
};
</script>
