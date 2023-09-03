<template>
  <div id="gift"></div>
</template>

<script>
import { gsap } from 'gsap';
import apis from '../../lib/showroom/apis';
import tools from '../../lib/showroom/tools';
import yamazakishizuku from '../../config/yamazakishizuku.config';
import showroomConfig from '../../config/showroom.config';
import Showroom from '../../lib/showroom/showroom';

export default {
  name: 'GiftPage',
  data() {
    return {
      showroom: null,
      gifts: null,
      width: 1850,
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
        const num = Math.floor(tools.getRandomNum(0, yamazakishizuku.free));
        const imgSrc = require(`@/assets/yamazakishizuku/img/gift/${num}.png`);
        this.fallGift(data, imgSrc);
      });

      this.showroom.on("paid", (data) => {
        const imgSrc = tools.giftUrlCheck(data, this.gifts);
        this.fallGift(data, imgSrc);
      });

      this.showroom.on("enquete", (data) => {
        this.fallGift(data);
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
    fallGift(data, imgSrc) {
      const elmId = Math.random().toString(32).substring(2);
      const count = data.n > 20 ? 10 : data.n;
      for (let i = 0; i < count; i++) {
        const id = `gift_${data.u}_${data.g}_${i}_${elmId}`;
        const giftImgElement = document.createElement('img');
        giftImgElement.src = imgSrc;
        giftImgElement.style.width = '140px';
        giftImgElement.setAttribute('id', id);
        giftImgElement.style.position = 'absolute';
        giftImgElement.style.top = '-140px';
        giftImgElement.style.left = tools.getRandomNum(10, this.width - 70) + 'px';
        document.getElementById('gift').append(giftImgElement);

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
