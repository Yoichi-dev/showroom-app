<template>
  <v-row class="mt-5" v-if="eventList.length != 0">
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

    <v-col
      cols="12"
      sm="6"
      lg="4"
      xl="3"
      v-for="(event, i) in eventList"
      :key="i"
    >
      <v-hover v-slot:default="{ hover }" close-delay="50">
        <v-card
          :elevation="hover ? 16 : 2"
          @click="clickLoading(event.event_id)"
        >
          <v-img v-if="endFlg" :src="event.image"></v-img>
          <v-img
            v-else
            :src="
              event.image
                .replace('_s.png', '_l.png')
                .replace('_s.jpeg', '_l.jpeg')
            "
          ></v-img>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["eventList", "endFlg"],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    clickLoading(event_id) {
      this.dialog = true;
      this.$router.push(`/event/${event_id}`);
    },
  },
};
</script>