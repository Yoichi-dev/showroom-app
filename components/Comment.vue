<template>
  <v-row>
    <v-dialog v-model="dialog" width="800" v-if="listenerData != null">
      <Listener @parentMethod="closeDialog" :listenerData="listenerData" />
    </v-dialog>
    <v-col cols="12">
      <v-card class="scrollbar" :height="styleSetting" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-simple-table dense>
              <template>
                <tbody>
                  <tr
                    v-for="(item, index) in commentList"
                    :key="index"
                    :class="
                      item.flg == 2
                        ? 'blue lighten-5'
                        : item.id == developerId
                        ? 'purple lighten-5'
                        : ''
                    "
                  >
                    <td
                      style="width: 25px"
                      class="pa-0 pointer"
                      @click="getUserData(item.id)"
                    >
                      <img
                        alt=""
                        height="25px"
                        width="25px"
                        :src="
                          'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                          item.avatar +
                          '.png?v=85'
                        "
                        data-holder-rendered="true"
                      />
                    </td>
                    <td
                      style="width: 15vw"
                      class="pa-0 pointer"
                      @click="getUserData(item.id)"
                    >
                      {{ item.name }}
                    </td>
                    <td>{{ item.comment }}</td>
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
  props: ["commentList", "developerId", "styleSetting"],
  data() {
    return {
      listenerData: null,
      dialog: false,
    };
  },
  methods: {
    getUserData(id) {
      this.listenerData = null;
      axios
        .get(`${process.env.API_URL}/api/live/listener/${id}`)
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