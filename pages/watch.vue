<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="9">
        <v-row>
          <video id="video" width="100%" controls autoplay playsinline :muted="osData"></video>
        </v-row>
        <v-row class="mt-10">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{ room.main_name }}
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="profile" class="text--primary"
                style="white-space: pre-wrap; word-wrap: break-word">
                {{
                  '\r\n' +
                  profile.description.replace(
                    /\r\n\r\n\r\n/g,
                    '\r\n'
                  )
                }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <!-- <v-row>
          <v-col v-if="streaming" class="d-flex" cols="12">
            <v-select v-model="select" :items="streaming" item-text="label" item-value="id" label="画質" return-object
              outlined></v-select>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="12">
            <v-card id="comment-area" elevation="2" class="">
              <v-card-text class="mt-0 pt-0">
                <div v-for="(commentItem, idx) in commentList" :key="idx" class="comment-box">
                  <img class="avater" :src="commentItem.av" :alt="commentItem.nm">
                  <div>
                    <div class="name">
                      {{ commentItem.nm }}
                    </div>
                    <div class="comment">
                      <span>{{ commentItem.cm }}</span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(onlive, i) in otherList" :key="i" cols="12">
            <v-hover v-slot="{ hover }" close-delay="50">
              <v-card class="mx-auto pointer" :elevation="hover ? 16 : 2"
                @click="$router.push(`/watch?room_id=${onlive.room_id}`)">
                <v-img class="white--text align-end" :src="onlive.image.replace('_s', '_m')">
                </v-img>
                <v-card-text class="text--primary">
                  <div>{{ onlive.main_name }}</div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Hls from "hls.js";
import axios from '~/plugins/axios'
import constants from '~/constants'
import Showroom from '~/plugins/showroom';

export default {
  name: 'WatchPage',
  beforeRouteLeave(to, from, next) {
    if (this.hls !== null) {
      this.hls.stopLoad()
      this.hls.destroy()
    }
    this.hls = null;
    this.showroom.disconnect()
    window.removeEventListener('resize', this.resizeWindow)
    next();
  },
  data() {
    return {
      showroom: null,
      room_id: this.$route.query.room_id,
      hls: null,
      osData: false,
      onliveList: [],
      otherList: [],
      room: null,
      profile: null,
      streaming: null,
      select: null,
      commentList: [],
      telop: '',
      title: ''
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  watch: {
    select(newValue, oldValue) {
      this.videoPlay()
      setTimeout(() => {
        this.osData = false
        document.getElementById('comment-area').style.height = document.getElementById('video').clientHeight + 'px'
      }, 500)
    },
    $route() {
      location.reload()
    }
  },
  created() {
    if (!this.$route.query.room_id) {
      this.$router.push('/')
      return
    }

    if (!sessionStorage.onlive) {
      this.$router.push('/')
      return
    }

    this.onliveList = JSON.parse(sessionStorage.onlive)

    for (const onlive of this.onliveList.onlives) {
      for (const room of onlive.lives) {
        if (room.room_id === Number(this.room_id)) {
          this.room = room
          break
        }
      }
    }
  },
  mounted() {

    this.osCheck();

    (async () => {
      await axios
        .post(constants.url.showroom_api, {
          category: 'live',
          type: 'streaming_url',
          key: this.room_id,
        })
        .then((res) => {
          const { data } = res
          if (Object.keys(data).length === 0) {
            this.$router.push('/')
            return
          }
          this.streaming = data.streaming_url_list.filter(url => url.type === 'hls')
          this.select = this.streaming[0]
        })
        .catch((e) => {
          // console.log(e)
        })

      await axios
        .post(constants.url.showroom_api, {
          category: 'live',
          type: 'comment_log',
          key: this.room_id,
        })
        .then((res) => {
          const { data } = res
          for (let i = data.comment_log.length - 1; i >= 0; i--) {
            const commentObj = {
              ac: data.comment_log[i].name,
              av: data.comment_log[i].avatar_id,
              cm: data.comment_log[i].comment,
              created_at: data.comment_log[i].created_at,
              u: data.comment_log[i].user_id,
              ua: data.comment_log[i].ua,
            }
            if (this.commentCountCheck(commentObj)) {
              this.commentList.unshift({
                nm: commentObj.ac,
                av: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${commentObj.av}.png`,
                cm: commentObj.cm,
              })
            }
          }
        })
        .catch((e) => {
          // console.log(e)
        })

      await axios
        .post(constants.url.showroom_api, {
          category: 'room',
          type: 'profile',
          key: this.room_id,
        })
        .then((res) => {
          const { data } = res
          this.profile = data
        })
        .catch((e) => {
          // console.log(e)
        })

    })()
    this.telop = this.room.telop
    this.title = this.room.main_name
    for (const room of this.onliveList.onlives) {
      if (room.genre_id === this.room.genre_id) {
        this.otherList = room.lives
      }
    }
    this.connect()
    window.addEventListener('resize', this.resizeWindow)
  },
  methods: {
    resizeWindow() {
      document.getElementById('comment-area').style.height = document.getElementById('video').clientHeight + 'px'
    },
    osCheck() {
      const ua = navigator.userAgent;
      if (/android/i.test(ua)) {
        // console.log(ua)
      } else if (
        /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      ) {
        this.osData = true;
      }
    },
    videoPlay() {
      const video = document.getElementById("video");
      const videoUrl = this.select.url;
      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(videoUrl);
        this.hls.attachMedia(video);
        setTimeout(() => {
          video.play();
        }, 100)
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("canplay", () => {
          setTimeout(() => {
            video.play();
          }, 100)
        });
      }
    },
    connect() {
      this.showroom = new Showroom(this.room, constants.ws);
      this.showroom.on("comment", (data) => {
        this.getComment(data)
      })
      this.showroom.on("telop", (data) => {
        this.telop = data
      })
      this.showroom.on("end", (data) => {
        this.showroom.disconnect()
        this.$router.push('/')
      })
      this.showroom.connect()
    },
    getComment(msgJson) {
      this.commentList.unshift({
        nm: msgJson.ac,
        av: `https://image.showroom-cdn.com/showroom-prod/image/avatar/${msgJson.av}.png`,
        cm: msgJson.cm
      })
    },
    commentCountCheck(msgJson) {
      if (msgJson.cm.includes('.')) {
        return true
      }
      const numberFormat = msgJson.cm.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      })
      if (
        !isNaN(numberFormat) &&
        Number(numberFormat) >= 0 &&
        Number(numberFormat) <= 50
      ) {
        return false
      } else {
        return true
      }
    }
  },
}
</script>

<style>
#comment-area {
  overflow: scroll;
}

#comment-area::-webkit-scrollbar {
  display: none;
}

video {
  padding-top: 12px;
}

.avater {
  width: 30px;
  height: 30px;
}

.name {
  font-size: 0.8em;
  color: darkgray;
}

.comment-box {
  border-bottom: 1px black;
  display: flex;
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: dotted 1px darkgray;
}

.comment {
  color: black;
  margin-top: 5px;
  font-size: 1.1em;
  word-break: break-all
}

img {
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
</style>