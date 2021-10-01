<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-img
        :src="
          userInfo.image
            .replace('_m.png', '_l.png')
            .replace('_m.jpeg', '_l.jpeg')
        "
      ></v-img>
    </v-col>
    <v-col cols="12" md="6">
      <v-simple-table>
        <template>
          <tbody>
            <tr>
              <td>ルーム名</td>
              <td>{{ userInfo.room_name }}</td>
            </tr>
            <tr>
              <td>ルームレベル</td>
              <td>{{ userInfo.room_level }}</td>
            </tr>
            <tr>
              <td>ジャンル</td>
              <td>{{ userInfo.genre_name }}</td>
            </tr>
            <tr>
              <td>配信ページ</td>
              <td>
                <a :href="userInfo.share_url_live" target="_blank">{{
                  userInfo.room_url_key
                }}</a>
              </td>
            </tr>
            <tr>
              <td>プロフィールページ</td>
              <td>
                <a :href="userInfo.share_url" target="_blank">{{
                  userInfo.room_id
                }}</a>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="mt-5 ml-1" v-if="userInfo.sns_list">
        <span v-for="(item, i) in userInfo.sns_list" :key="i">
          <a :href="item.url" target="_blank">
            <v-img max-width="50" :src="item.icon"></v-img>
          </a>
        </span>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  props: ["userInfo"],
  methods: {
    formatYmdDate(inputDate) {
      return moment.unix(inputDate).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>