<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      lg="3"
      xl="3"
      v-for="(info, index) in infoData"
      :key="index"
    >
      <v-card class="mx-auto" outlined>
        <v-list-item three-line>
          <v-list-item-content v-if="info.title != '配信開始時間'">
            <div class="text-overline mb-4">{{ info.title }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ info.title == "獲得ポイント" ? "約" : "" }}
              {{ info.num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") }}
              {{ info.title == "獲得ポイント" ? "pt" : "人" }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            <div class="text-overline mb-4">{{ info.title }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ formatTime(info.liveStartDate) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              経過時間 {{ elapsedTime }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-icon size="80">{{ info.icon }}</v-icon>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  props: ["infoData"],
  data() {
    return {
      elapsedTime: null,
    };
  },
  methods: {
    formatTime(time) {
      let formatTime = "";
      if (time != "") {
        formatTime = moment(time * 1000).format("H時mm分ss秒");
        // 経過時間
        setInterval(() => {
          let past_time = new Date(time * 1000);
          let diff_time = Date.now() - past_time.getTime();
          let pass_seconds = Math.floor(diff_time / 1000);
          let num = pass_seconds;
          let timeH = Math.floor((num % (24 * 60 * 60)) / (60 * 60));
          let timeM = Math.floor(((num % (24 * 60 * 60)) % (60 * 60)) / 60);
          let timeS = ((num % (24 * 60 * 60)) % (60 * 60)) % 60;
          let timeDMS = timeH + "時間" + timeM + "分" + timeS + "秒";
          this.elapsedTime = timeDMS;
        }, 1000);
      }
      return formatTime;
    },
  },
};
</script>
