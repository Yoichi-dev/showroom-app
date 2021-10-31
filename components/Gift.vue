<template>
  <v-row>
    <v-dialog v-model="dialog" width="800" v-if="listenerData != null">
      <Listener @parentMethod="closeDialog" :listenerData="listenerData" />
    </v-dialog>
    <v-col cols="12">
      <v-card class="mx-auto scrollbar" :height="styleSetting" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr
                    v-for="(gift, index) in gifts"
                    :key="index"
                    @click="userData(gift.id)"
                    :class="
                      gift.flg == 2
                        ? 'pointer blue lighten-5'
                        : gift.id == developerId
                        ? 'pointer purple lighten-5'
                        : 'pointer'
                    "
                  >
                    <td class="pa-0" style="width: 25px">
                      <img
                        alt=""
                        height="25px"
                        width="25px"
                        :src="
                          'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                          gift.avatar +
                          '.png?v=85'
                        "
                        data-holder-rendered="true"
                      />
                    </td>
                    <td>{{ gift.name }}</td>
                    <td style="width: 130px">
                      <img
                        alt=""
                        width="25px"
                        height="25px"
                        class="img-responsive gift-img"
                        style="float: left"
                        :src="
                          'https://image.showroom-cdn.com/showroom-prod/assets/img/gift/' +
                          gift.gitId +
                          '_s.png'
                        "
                        data-holder-rendered="true"
                      />
                      × {{ gift.num }}
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
  props: ["gifts", "developerId", "styleSetting"],
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