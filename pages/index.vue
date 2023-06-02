<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="(onlive, i) in viewList" :key="i" cols="12" sm="4" lg="4" xl="3">
        <v-hover v-slot="{ hover }" close-delay="50">
          <v-card class="mx-auto pointer" :elevation="hover ? 16 : 2"
            @click="$router.push(`/watch?room_id=${onlive.room_id}`)">
            <v-img class="white--text align-end" :src="onlive.image.replace('_s', '_m')">
              <v-card-title v-if="onlive.label" class="grey darken-1 card-label">{{ onlive.label }}</v-card-title>
            </v-img>
            <v-card-text class="text--primary">
              <div>{{ onlive.telop ? onlive.telop : '&emsp;' }}</div>
              <div>{{ onlive.main_name }}</div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from '~/plugins/axios'
import constants from '~/constants'

export default {
  name: 'IndexPage',
  data() {
    return {
      genre: this.$route.query.genre_id | 0,
      onliveList: [],
      viewList: [],
      title: 'HOME'
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  watch: {
    genre(newValue, oldValue) {
      this.viewList = this.onliveList.filter(room => room.genre_id === newValue)
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  },
  created() {
    this.setListener()
  },

  mounted() {

    axios
      .post(constants.url.showroom_api, {
        category: 'live',
        type: 'onlives',
        key: new Date().getTime(),
      })
      .then((res) => {
        const { data } = res
        sessionStorage.onlive = JSON.stringify(data)
        const menu = []
        for (const onlive of data.onlives) {
          menu.push({
            title: onlive.genre_name,
            id: onlive.genre_id,
            to: `/?genre_id=${onlive.genre_id}`,
          })
          // TODO
          for (const room of onlive.lives) {
            room.genre_name = onlive.genre_name
            room.genre_id = onlive.genre_id
            this.onliveList.push(room)
          }
        }
        this.$nuxt.$emit('updateMenu', menu)
        this.viewList = this.onliveList.filter(room => room.genre_id === this.genre)
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    setListener() {
      this.$nuxt.$on('updateGenre', this.setGenre)
    },
    setGenre(genre) {
      this.genre = genre || 0
    }
  }
}
</script>

<style>
.card-label {
  opacity: 80%;
  padding: 1px 1px 1px 15px;
  font-size: 0.8em;
}

.pointer {
  cursor: pointer;
}
</style>