<template>
  <div id="bg">
    <!-- <img :src="require('/assets/ac6937031783/img/bg/default.png')" class="overlay" /> -->
    <div id="comment-area">
      <div v-for="(comment, idx) in comments" :key="idx" class="comment-box">
        <img class="avater" :src="comment.avatar_url">
        <div v-if="comment.stamp">
          <div class="name">{{ comment.name }}</div>
          <img class="stamp" :src="comment.comment" :alt="comment.name">
        </div>
        <div v-else>
          <div class="name">{{ comment.name }}</div>
          <div class="comment">{{ comment.comment }}</div>
        </div>
      </div>
    </div>
    <div id="free-area">
      <div v-for="(item, idx) in free" :key="idx" class="gift-box">
        <img class="avater" :src="item.avatar_url">
        <div>
          <div class="name">{{ item.name }}</div>
          <div class="gift">
            <img class="gift-img" :src="item.image_url">
            × {{ item.num }}
          </div>
        </div>
      </div>
    </div>
    <div id="paid-area">
      <div v-for="(pai, idx) in paid" :key="idx" class="gift-box">
        <img class="avater" :src="pai.avatar_url">
        <div>
          <div class="name">{{ pai.name }}</div>
          <div class="gift">
            <img class="gift-img" :src="pai.image_url">
            × {{ pai.num }}
          </div>
        </div>
      </div>
    </div>
    <div id="stage-area">
      <div v-for="(userObj, idx) in stage" :key="idx" class="stage-box" :style="`animation-delay: ${yurayura[idx]}s;`">
        <div>
          <div class="stage-name">{{ userObj.order_no }}位<br />{{ userObj.user.name }}</div>
          <div class="stage-avater">
            <img class="stage-avater-img" :src="userObj.user.avatar_url">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import apis from '../../lib/showroom/apis';
import tools from '../../lib/showroom/tools';
import ac6937031783 from '../../config/ac6937031783.config';
import showroomConfig from '../../config/showroom.config';
import Showroom from '../../lib/showroom/showroom';

export default {
  name: 'DefaultPage',
  data() {
    return {
      title: '深目子',
      showroom: null,
      comments: [],
      free: [],
      paid: [],
      stage: [],
      stagePing: null,
      gifts: null,
      width: 1920, // SR -> 1280 x 720
      yurayura: [1, 3, 5, 7, 9, 11, 13, 12, 10, 8, 6, 4, 2]
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    (async () => {
      const gift = await apis.giftList(ac6937031783.room_id);
      this.gifts = gift;

      const status = await apis.status(ac6937031783.room_url_key);

      if (status.live_type === 0 && status.data.is_live) {
        // 配信中
        this.connect(status.data.broadcast_key);
        // コメントログ
        const commentLog = await apis.getCommentLog(ac6937031783.room_id);
        this.commentLog(commentLog);
        // ギフトログ
        const giftLog = await apis.getGiftLog(ac6937031783.room_id);
        this.giftLog(giftLog);

        this.stagePing = setInterval(() => {
          // ステージ
          apis.getStageUserList(ac6937031783.room_id).then((val) => {
            if (val.stage_user_list.length > 13) {
              const stageList = [];
              stageList.push(val.stage_user_list[11]);
              stageList.push(val.stage_user_list[9]);
              stageList.push(val.stage_user_list[7]);
              stageList.push(val.stage_user_list[5]);
              stageList.push(val.stage_user_list[3]);
              stageList.push(val.stage_user_list[1]);
              stageList.push(val.stage_user_list[0]);
              stageList.push(val.stage_user_list[2]);
              stageList.push(val.stage_user_list[4]);
              stageList.push(val.stage_user_list[6]);
              stageList.push(val.stage_user_list[8]);
              stageList.push(val.stage_user_list[10]);
              stageList.push(val.stage_user_list[12]);
              this.stage = stageList;
              setTimeout(() => {
                // TODO 0だったら1にするよう修正
                document.getElementById('stage-area').style.opacity = 1;
              }, 13000);
            }
          });
        }, 60000);

      } else if (status.live_type === 0 && !status.data.is_live) {
        // 配信前
        this.connect(status.data.broadcast_key);
      }
    })();
  },
  methods: {
    connect(key) {

      this.showroom = new Showroom(key, showroomConfig.ws);

      this.showroom.on('free', (data) => {
        // this.fallGift(data);
        this.addFreeGift(data);
      });

      this.showroom.on('paid', (data) => {
        // this.fallGift(data);
        this.addPaidGift(data);
      });

      this.showroom.on('enquete', (data) => {
        this.fallGift(data);
      });

      this.showroom.on('comment', (data) => {
        this.addComment(data);
      });

      this.showroom.on('start', (data) => {
        this.showroom.disconnect();
        location.reload();
      });

      this.showroom.on('end', (data) => {
        this.showroom.disconnect();
        clearInterval(this.stagePing);
        location.reload();
      });

      this.showroom.on('error', (data) => {
        location.reload();
      });

      this.showroom.connect();
    },
    addComment(data) {
      const comment = {
        user_id: data.u,
        name: data.ac,
        avatar_url: `https://static.showroom-live.com/image/avatar/${data.av}.png?v=${showroomConfig.v}`,
        comment: data.cm,
        stamp: false
      }

      // スタンプ確認
      const stamp = ac6937031783.stamp_key_word.some(elm => elm.key === data.cm);
      if (stamp) {
        const stampObj = ac6937031783.stamp_key_word.find(elm => elm.key === data.cm);
        comment.comment = require(`@/assets/ac6937031783/img/stamp/${stampObj.img}`);
        comment.stamp = true;
      }

      // エフェクト確認
      // const fall = ac6937031783.fall_key_word.some(elm => elm.key === data.cm);
      // if (fall) {
      //   const fallObj = ac6937031783.fall_key_word.find(elm => elm.key === data.cm);
      //   const src = require(`@/assets/ac6937031783/img/fall/${fallObj.img}`);
      //   const fallData = {
      //     n: 20,
      //     g: 'original',
      //     u: data.u,
      //   };
      //   this.fallGift(fallData, src);
      // }

      this.comments.unshift(comment);
    },
    addFreeGift(data) {
      const url = tools.giftUrlCheck(data, this.gifts);
      const free = {
        user_id: data.u,
        name: data.ac,
        avatar_url: `https://static.showroom-live.com/image/avatar/${data.av}.png?v=${showroomConfig.v}`,
        num: data.n,
        gift_id: data.g,
        image: url
      };
      this.deduplicationFreeGift(free);
    },
    addPaidGift(data) {
      const url = tools.giftUrlCheck(data, this.gifts);
      const paid = {
        user_id: data.u,
        name: data.ac,
        avatar_url: `https://static.showroom-live.com/image/avatar/${data.av}.png?v=${showroomConfig.v}`,
        num: data.n,
        gift_id: data.g,
        image: url
      };
      this.deduplicationPreGift(paid);
    },
    commentLog(commentLog) {
      for (let i = 0; i < commentLog.comment_log.length; i++) {
        if (tools.commentCountCheck(commentLog.comment_log[i])) {
          const comment = {
            user_id: commentLog.comment_log[i].user_id,
            name: commentLog.comment_log[i].name,
            avatar_url: commentLog.comment_log[i].avatar_url,
            comment: commentLog.comment_log[i].comment,
            stamp: false
          }
          const stamp = ac6937031783.stamp_key_word.some(elm => elm.key === commentLog.comment_log[i].comment);
          if (stamp) {
            const stampObj = ac6937031783.stamp_key_word.find(elm => elm.key === commentLog.comment_log[i].comment);
            comment.comment = require(`@/assets/ac6937031783/img/stamp/${stampObj.img}`);
            comment.stamp = true;
          }
          this.comments.push(comment);
        }
      }
    },
    giftLog(giftLog) {
      for (const giftObjsRaw of giftLog.gift_log) {
        this.deduplicationPreGift(giftObjsRaw);
      }
    },
    fallGift(data) {
      const img = tools.giftUrlCheck(data, this.gifts);
      const elmId = Math.random().toString(32).substring(2);
      const count = data.n > 20 ? 10 : data.n;
      for (let i = 0; i < count; i++) {
        const id = `gift_${data.u}_${data.g}_${i}_${elmId}`;
        const giftImgElement = document.createElement('img');
        giftImgElement.src = img;
        giftImgElement.style.width = '80px';
        giftImgElement.setAttribute('id', id);
        giftImgElement.style.position = 'absolute';
        giftImgElement.style.zIndex = '20';
        giftImgElement.style.top = '-100px';
        giftImgElement.style.left = tools.getRandomNum(10, this.width - 70) + 'px';
        document.getElementById('bg').append(giftImgElement);

        setTimeout(() => {
          this.gsaoExe(id);
        }, 500);
      }
    },
    gsaoExe(elementId) {
      gsap.to(`#${elementId}`, {
        duration: tools.getRandomNum(6, 9),
        rotation: tools.getRandomNum(90, 720),
        y: 1200,
        onComplete: () => {
          if (document.getElementById(elementId) !== null) {
            document.getElementById(elementId).remove();
          }
        },
      });
      setTimeout(() => {
        if (document.getElementById(elementId) !== null) {
          document.getElementById(elementId).remove();
        }
      }, 10000);
    },
    deduplicationPreGift(data) {
      // 既に存在するか確認
      if (
        this.paid.some((e) => e.user_id === data.user_id && e.gift_id === data.gift_id)
      ) {
        for (const i in this.paid) {
          if (
            this.paid[i].user_id === data.user_id &&
            this.paid[i].gift_id === data.gift_id
          ) {
            this.paid[i].num += data.num
            this.paid[i].name = data.name
            this.paid[i].avatar_url = data.avatar_url
          }
        }
        let preGiftData = null
        for (let i = 0; i < this.paid.length; i++) {
          if (
            this.paid[i].user_id === data.user_id &&
            this.paid[i].gift_id === data.gift_id
          ) {
            preGiftData = this.paid[i]
            this.paid.splice(i, 1)
            this.paid.unshift(preGiftData)
          }
        }
      } else {
        this.paid.unshift({
          user_id: data.user_id,
          name: data.name,
          gift_id: data.gift_id,
          num: data.num,
          avatar_url: data.avatar_url,
          image_url: data.image,
        });
      }
    },
    deduplicationFreeGift(data) {
      // 既に存在するか確認
      if (this.free.some((e) => e.user_id === data.user_id)) {
        for (const i in this.free) {
          if (this.free[i].user_id === data.user_id) {
            this.free[i].num += data.num
            this.free[i].gift_id = data.gift_id
            this.free[i].name = data.name
            this.free[i].avatar_url = data.avatar_url
          }
        }
        let freeGiftData = null;
        for (let i = 0; i < this.free.length; i++) {
          if (this.free[i].user_id === data.user_id) {
            freeGiftData = this.free[i];
            this.free.splice(i, 1);
            this.free.unshift(freeGiftData);
          }
        }
      } else {
        this.free.unshift({
          user_id: data.user_id,
          name: data.name,
          gift_id: data.gift_id,
          num: data.num,
          avatar_url: data.avatar_url,
          image_url: data.image,
        })
      }
    }
  }
}
</script>

<style>
body {
  margin: 0 !important;
}

#bg {
  width: 100vw;
  height: 100vh;
  /* background-image: url('~/assets/ac6937031783/img/bg/default.jpg'); */
}

.overlay {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 10;
}

/* @font-face {
  font-family: 'onryou';
  src: url('~/assets/ac6937031783/font/onryou.TTF') format('truetype');
} */

/* #bg {
  font-family: 'onryou';
} */

#comment-area {
  position: absolute;
  top: 260px;
  left: 170px;
  width: 510px;
  /* width: 430px; */
  height: 625px;
  overflow: scroll;
}

#free-area {
  position: absolute;
  top: 260px;
  left: 720px;
  /* left: 618px; */
  width: 330px;
  height: 300px;
  overflow: scroll;
}

#paid-area {
  position: absolute;
  top: 565px;
  left: 720px;
  /* left: 618px; */
  width: 330px;
  height: 300px;
  overflow: scroll;
}

#stage-area {
  color: white;
  position: absolute;
  display: flex;
  text-align: center;
  top: 975px;
  left: -25px;
  z-index: 20;
  opacity: 0;
}

#comment-area::-webkit-scrollbar {
  display: none;
}

#free-area::-webkit-scrollbar {
  display: none;
}

#paid-area::-webkit-scrollbar {
  display: none;
}

.comment {
  margin-top: 0.8em;
  font-size: 1.5em;
}

.name {
  font-size: 1em;
}

.comment-box {
  display: flex;
  color: white;
  margin-bottom: 2em;
}

.gift-box {
  display: flex;
  color: white;
  margin-bottom: 1em;
}

.stamp {
  margin-top: 1em;
  height: 150px;
  width: 150px;
}

.avater {
  margin-top: 15px;
  margin-right: 15px;
  width: 50px;
  height: 50px;
}

.gift {
  margin-top: 5px;
  margin-right: 15px;
}

.gift-img {
  width: 30px;
  height: 30px;
}

.stage-name {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stage-avater-img {
  width: 90px;
  height: 90px;
}

.stage-box {
  transform-origin: center bottom;
  animation: yurayura 5s linear infinite;
}

@keyframes yurayura {

  0%,
  100% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(-10deg);
  }
}
</style>