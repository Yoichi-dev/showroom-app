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
        type: "error",
        message: "最終集計ptはイベント終了後翌日14時に登録されます",
      },
    };
  },
  mounted() {
    axios
      .get(process.env.MICROCMS_URL + "/showroom", {
        headers: { "X-MICROCMS-API-KEY": process.env.MICROCMS_KEY },
      })
      .then((res) => {
        this.info = res.data.contents[1];
      });
  },
};
</script>