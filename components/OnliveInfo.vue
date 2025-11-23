<template>
  <v-row>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="createPoint(infoData)">
        獲得ポイント
      </InfoCard>
    </v-col>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="checkFlg ? createFollwer(infoData) : createNot('mdi-heart-outline')
        ">フォロワー</InfoCard>
    </v-col>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="checkFlg
        ? createView(infoData)
        : createNot('mdi-account-multiple-outline')
        ">盛り上がり</InfoCard>
    </v-col>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="createTime(infoData)"> 配信開始時間 </InfoCard>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import InfoCard from '~/components/InfoCard'

export default {
  name: 'OnliveInfo',
  components: {
    InfoCard,
  },
  props: {
    infoData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    checkFlg: false,
    lift: 0,
    register: Math.floor(new Date().getTime() / 1000),
    experience: Math.floor(new Date().getTime() / 1000) - 259200,
  }),
  created() {
    // 解除判定
    if (
      localStorage.lift === '1' ||
      Number(localStorage.register) >
      Math.floor(new Date().getTime() / 1000) - 259200
    ) {
      this.checkFlg = true
    }
  },
  methods: {
    createPoint(infoObj) {
      return {
        main: `約 ${this.$numberFormat(
          infoObj.free + infoObj.pre
        )}pt`,
        sub: `無料 ${this.$numberFormat(
          infoObj.free
        )}pt | 有料 ${this.$numberFormat(
          infoObj.pre
        )}pt`,
        icon: infoObj.isOfficial ? 'mdi-star-outline' : 'mdi-sprout-outline',
      }
    },
    createFollwer(infoObj) {
      return {
        main: `${this.$numberFormat(infoObj.follwer)}人`,
        sub: `開始から ${infoObj.follwer >= infoObj.startFollwer ? '+' : ''}
        ${this.$numberFormat(infoObj.follwer - infoObj.startFollwer)}人`,
        icon: 'mdi-heart-outline',
      }
    },
    createNot(icon) {
      return {
        main: '無効化中',
        sub: '未登録の為',
        icon,
      }
    },
    createView(infoObj) {
      return {
        main: `${this.$numberFormat(infoObj.view)}`,
        sub: `1分前から +${this.$numberFormat(
          infoObj.view - infoObj.startView
        )}`,
        icon: 'mdi-account-multiple-outline',
      }
    },
    createTime(infoObj) {
      return {
        main: moment(infoObj.startTime * 1000).format('H時 mm分 ss秒'),
        sub: `経過時間 ${infoObj.elapsedTime}`,
        icon: 'mdi-clock-outline',
      }
    },
  },
}
</script>
