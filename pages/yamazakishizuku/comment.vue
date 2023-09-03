<template>
  <div id="comment-area">
    <div v-for="(comment, idx) in comments" :key="idx" class="comment-box">
      <img :src="comment.avatar_url" :alt="comment.name">
      <div v-if="comment.stamp">
        <div class="name">
          {{ comment.name }}
        </div>
        <img class="stamp" :src="comment.comment" :alt="comment.name">
      </div>
      <div v-else>
        <div class="name">
          {{ comment.name }}
        </div>
        <div class="comment">
          <span>{{ comment.comment }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apis from '../../lib/showroom/apis';
import tools from '../../lib/showroom/tools';
import yamazakishizuku from '../../config/yamazakishizuku.config';
import showroomConfig from '../../config/showroom.config';
import Showroom from '../../lib/showroom/showroom';

export default {
  name: 'CommentPage',
  data() {
    return {
      showroom: null,
      comments: [],
      gifts: null,
      width: 1920
    }
  },
  mounted() {
    (async () => {
      const gift = await apis.giftList(yamazakishizuku.room_id);
      this.gifts = gift;

      const status = await apis.status(yamazakishizuku.room_url_key);

      if (status.live_type === 0 && status.data.is_live) {
        // 配信中
        this.connect(status.data.broadcast_key);
        // コメントログ
        const commentLog = await apis.getCommentLog(yamazakishizuku.room_id);
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
      const editName = tools.nameCut(data.ac) + "先生";
      const stamp = yamazakishizuku.key_word.find(item => item.key === data.cm);
      const comment = {
        name: editName,
        avatar_url: `https://static.showroom-live.com/image/avatar/${data.av}.png?v=${showroomConfig.v}`,
        comment: data.cm,
        stamp: false
      }

      if (stamp) {
        comment.comment = require(`@/assets/yamazakishizuku/img/stamp/${stamp.img}`)
        comment.stamp = true;
      }

      this.comments.push(comment);

      setTimeout(() => {
        document.getElementById('comment-area').scrollTop = document.getElementById('comment-area').scrollHeight
      }, 500)
    },
    commentLog(commentLog) {
      for (let i = commentLog.comment_log.length - 1; i >= 0; i--) {
        if (tools.commentCountCheck(commentLog.comment_log[i])) {
          const editName = tools.nameCut(commentLog.comment_log[i].name) + "先生";
          this.comments.push({
            user_id: commentLog.comment_log[i].user_id,
            name: editName,
            avatar_url: commentLog.comment_log[i].avatar_url,
            comment: commentLog.comment_log[i].comment
          });
        }
      }
      setTimeout(() => {
        document.getElementById('comment-area').scrollTop = document.getElementById('comment-area').scrollHeight
      }, 500)
    }
  }
}
</script>

<style>
#comment-area {
  max-height: 100vh;
  overflow: scroll;
  color: white;
}

#comment-area::-webkit-scrollbar {
  display: none;
}

.comment-box {
  border-bottom: 2px rgba(255, 255, 255, 1) dashed;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
}

.comment {
  margin-top: 5px;
  font-size: 1.5em;
}

img {
  float: left;
  width: 50px;
  height: 50px;
  margin: 10px;
}

.stamp {
  width: 200px;
  height: 200px;
}
</style>