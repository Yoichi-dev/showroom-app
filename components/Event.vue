<template>
  <v-row class="mt-5" v-if="eventList.length != 0">
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
          @click="$router.push('/event/' + event.event_id)"
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
};
</script>