<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-img
        :src="
          eventInfo.image
            .replace('_s.png', '_l.png')
            .replace('_s.jpeg', '_l.jpeg')
        "
      ></v-img>
    </v-col>
    <v-col cols="12" md="6">
      <v-simple-table>
        <template>
          <tbody>
            <tr>
              <td>イベント名</td>
              <td>
                <a :href="eventInfo.event_url" target="_blank">{{
                  eventInfo.event_name
                }}</a>
              </td>
            </tr>
            <tr>
              <td>イベントID</td>
              <td>{{ eventInfo.event_id }}</td>
            </tr>
            <tr>
              <td>開始日</td>
              <td>{{ formatYmdDate(eventInfo.started_at) }}</td>
            </tr>
            <tr>
              <td>終了日</td>
              <td>{{ formatYmdDate(eventInfo.ended_at) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

export default {
  props: ["eventInfo"],
  methods: {
    formatYmdDate(inputDate) {
      return moment.unix(inputDate).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>