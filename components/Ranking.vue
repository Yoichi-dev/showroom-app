<template>
  <v-row>
    <v-dialog v-model="dialog" width="800" v-if="listenerData != null">
      <Listener @parentMethod="closeDialog" :listenerData="listenerData" />
    </v-dialog>

    <v-col cols="12">
      <v-card class="mx-auto scrollbar" :height="styleSetting" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">配信内ランキング(100位まで)</div>
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr
                    v-for="rank in rankingList"
                    :key="rank.rank"
                    :class="
                      rank.flg == 2
                        ? 'pointer blue lighten-5'
                        : rank.user.user_id == developerId
                        ? 'pointer purple lighten-5'
                        : 'pointer'
                    "
                    @click="userData(rank.user.user_id)"
                  >
                    <td>{{ rank.rank }}</td>
                    <td class="pa-0">
                      <img
                        alt=""
                        height="25px"
                        width="25px"
                        :src="rank.user.avatar_url"
                        data-holder-rendered="true"
                      />
                    </td>
                    <td>
                      {{ rank.user.name }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: ["rankingList", "developerId", "styleSetting"],
  data() {
    return {
      dialog: false,
      listenerData: null,
    };
  },
  methods: {
    userData(id) {
      this.listenerData = null;
      axios
        .get(`${process.env.API_SUB_URL}/api/live/listener/${id}`)
        .then((response) => {
          this.listenerData = response.data;
          this.dialog = true;
          this.listenerData.account_id = id;
        });
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.scrollbar {
  overflow: scroll;
}

.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>