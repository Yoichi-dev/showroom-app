<template>
  <v-row class="mt-5 px-3" justify="center">
    <v-alert outlined :type="info.type" prominent border="left">
      <div v-html="info.message"></div>
    </v-alert>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      info: {
        type: "info",
        message:
          'このサイト専用のTwitterアカウント（<a href="https://twitter.com/SrPointHistory" target="_blank">@SrPointHistory</a>）作成したので是非フォローしてください！',
      },
    };
  },
  mounted() {
    axios
      .get(process.env.MICROCMS_URL + "/showroom", {
        headers: { "X-MICROCMS-API-KEY": process.env.MICROCMS_KEY },
      })
      .then((res) => {
        this.info = res.data.contents[0];
      });
  },
};
</script>