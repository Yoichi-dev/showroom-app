<template>
  <v-row justify="center" class="mt-5">
    <div class="text-center">
      <v-dialog v-model="dialog" persistent width="500">
        <v-card color="green" dark>
          <v-card-text>
            読み込み中...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <v-expansion-panels :mandatory="true" popout>
      <v-expansion-panel>
        <v-expansion-panel-header>参加者リスト</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="user in userList" :key="user.room_id">
                  <td>{{ user.juni }}位</td>
                  <td>{{ user.room_name }}</td>
                  <td>
                    <v-btn
                      class="ma-2"
                      outlined
                      color="green"
                      @click="clickLoading(user.event_id, user.room_id)"
                    >
                      個別分析
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
export default {
  props: ["userList"],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    clickLoading(event_id, room_id) {
      this.dialog = true;
      this.$router.push(`/event/${event_id}/${room_id}`);
    },
  },
};
</script>