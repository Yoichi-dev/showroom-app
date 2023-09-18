<template>
  <div id="bg">
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
  </div>
</template>

<script>
import { gsap } from 'gsap';
import apis from '../../lib/showroom/apis';
import tools from '../../lib/showroom/tools';
import tsukumo999 from '../../config/tsukumo999.config';
import showroomConfig from '../../config/showroom.config';
import Showroom from '../../lib/showroom/showroom';

export default {
  name: 'DefaultPage',
  data() {
    return {
      title: '胡蝶つくも',
      showroom: null,
      comments: [],
      gifts: null,
      width: 1920
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  mounted() {
    (async () => {
      const gift = await apis.giftList(tsukumo999.room_id);
      this.gifts = gift;

      const status = await apis.status(tsukumo999.room_url_key);

      if (status.live_type === 0 && status.data.is_live) {
        // 配信中
        this.connect(status.data.broadcast_key);
        // コメントログ
        const commentLog = await apis.getCommentLog(tsukumo999.room_id);
        this.commentLog(commentLog);
      } else if (status.live_type === 0 && !status.data.is_live) {
        // 配信前
        this.connect(status.data.broadcast_key);
      }
    })();
  },
  methods: {
    connect(key) {

      this.showroom = new Showroom(key, showroomConfig.ws);

      this.showroom.on("free", (data) => {
        const img = tools.giftUrlCheck(data, this.gifts);
        this.fallGift(data, img);
      });

      this.showroom.on("paid", (data) => {
        const img = tools.giftUrlCheck(data, this.gifts);
        this.fallGift(data, img);
      });

      this.showroom.on("enquete", (data) => {
        const img = tools.giftUrlCheck(data, this.gifts);
        this.fallGift(data, img);
      });

      this.showroom.on("comment", (data) => {
        this.addComment(data);
      });

      this.showroom.on("start", (data) => {
        this.showroom.disconnect();
        location.reload();
      });

      this.showroom.on("end", (data) => {
        this.showroom.disconnect();
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
      const stamp = tsukumo999.stamp_key_word.some(elm => elm.key === data.cm);
      if (stamp) {
        const stampObj = tsukumo999.stamp_key_word.find(elm => elm.key === data.cm);
        comment.comment = require(`@/assets/tsukumo999/img/stamp/${stampObj.img}`);
        comment.stamp = true;
      }
      // エフェクト確認
      const fall = tsukumo999.fall_key_word.some(elm => elm.key === data.cm);
      if (fall) {
        const fallObj = tsukumo999.fall_key_word.find(elm => elm.key === data.cm);
        const src = require(`@/assets/tsukumo999/img/fall/${fallObj.img}`);
        const fallData = {
          n: 20,
          g: 'original',
          u: data.u,
        };
        this.fallGift(fallData, src);
      }

      this.comments.unshift(comment);
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
          const stamp = tsukumo999.stamp_key_word.some(elm => elm.key === commentLog.comment_log[i].comment);
          if (stamp) {
            const stampObj = tsukumo999.stamp_key_word.find(elm => elm.key === commentLog.comment_log[i].comment);
            comment.comment = require(`@/assets/tsukumo999/img/stamp/${stampObj.img}`);
            comment.stamp = true;
          }
          this.comments.push(comment);
        }
      }
    },
    fallGift(data, img) {
      const elmId = Math.random().toString(32).substring(2);
      const count = data.n > 20 ? 10 : data.n;
      for (let i = 0; i < count; i++) {
        const id = `gift_${data.u}_${data.g}_${i}_${elmId}`;
        const giftImgElement = document.createElement('img');
        giftImgElement.src = img;
        giftImgElement.style.width = '100px';
        giftImgElement.setAttribute('id', id);
        giftImgElement.style.position = 'absolute';
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
  background-image: url("~/assets/tsukumo999/img/bg/bg.jpg");
}

@font-face {
  font-family: 'jkmarugo';
  src: url('~/assets/tsukumo999/font/JK-Maru-Gothic-M.otf') format("opentype");
}

#comment-area {
  position: absolute;
  top: 190px;
  left: 290px;
  width: 713px;
  height: 660px;
  overflow: scroll;
  font-family: 'jkmarugo';
}

#comment-area::-webkit-scrollbar {
  display: none;
}

.comment {
  font-size: 2.5em;
}

.name {
  font-size: 1.5em;
}

.comment-box {
  display: flex;
  color: white;
  margin-bottom: 2em;
}

.stamp {
  height: 150px;
  width: 150px;
}

.avater {
  margin-top: 15px;
  margin-right: 15px;
  width: 75px;
  height: 75px;
}
</style>