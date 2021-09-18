<template>
  <v-card>
    <v-tabs color="deep-purple accent-4">
      <v-tab>リスナー情報</v-tab>
      <v-tab v-if="listenerData.room_profile != null">配信者情報</v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col cols="2" align="center">
              <v-row>
                <v-img :src="listenerData.image" alt="" width="100px"></v-img>
                <v-img
                  :src="listenerData.avatar_url"
                  alt=""
                  width="100px"
                ></v-img>
              </v-row>
              <v-row v-if="listenerData.sns_list != null">
                <span v-for="(item, i) in listenerData.sns_list" :key="i">
                  <a :href="item.url" target="_blank"
                    ><v-img max-width="50" :src="item.icon"></v-img
                  ></a>
                </span>
              </v-row>
            </v-col>

            <v-col cols="10">
              <div class="mb-5">
                {{ listenerData.name }}
                <div v-if="listenerData.account_id == adminId">
                  私がこのアプリの開発者です
                </div>
              </div>
              <div
                class="caption"
                v-for="(text, index) in listenerData.description.split('\n')"
                :key="index"
              >
                {{ text }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item v-if="listenerData.room_profile != null">
        <v-container fluid>
          <v-row class="ma-2">
            <v-col cols="4" align="center">
              <v-row>
                <v-img :src="listenerData.room_profile.image" alt=""> </v-img>
              </v-row>
              <v-row v-if="listenerData.room_profile.sns_list != null">
                <span
                  v-for="(item, i) in listenerData.room_profile.sns_list"
                  :key="i"
                >
                  <a :href="item.url" target="_blank"
                    ><v-img max-width="50" :src="item.icon"></v-img
                  ></a>
                </span>
              </v-row>
            </v-col>

            <v-col cols="8">
              <div class="mb-5">
                {{ listenerData.room_profile.room_name }}
              </div>
              <div
                class="caption"
                v-for="(
                  text, index
                ) in listenerData.room_profile.description.split('\n')"
                :key="index"
              >
                {{ text }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="grey lighten-3" @click="closeDialog()" right rounded text>
        　閉じる　
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["dialog", "listenerData"],
  data() {
    return {
      adminId: "3699368",
    };
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("parentMethod");
    },
  },
};
</script>
