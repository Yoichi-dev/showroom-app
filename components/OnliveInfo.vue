<template>
  <v-row>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="createPoint(infoData)">
        獲得ポイント
      </InfoCard>
    </v-col>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="createFollwer(infoData)">フォロワー</InfoCard>
    </v-col>
    <v-col cols="12" sm="6" lg="3" class="py-2">
      <InfoCard :info-card-data="createView(infoData)">来場者</InfoCard>
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
  data() {
    return {}
  },
  methods: {
    createPoint(infoObj) {
      return {
        main: `約 ${this.$numberFormat(
          infoObj.free + infoObj.pre + infoObj.count
        )}pt`,
        sub: `無料 ${this.$numberFormat(
          infoObj.free
        )}pt | 有料 ${this.$numberFormat(
          infoObj.pre
        )}pt | カウント ${this.$numberFormat(infoObj.count)}pt`,
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
    createView(infoObj) {
      return {
        main: `${this.$numberFormat(infoObj.view)}人`,
        sub: `1分前から +${this.$numberFormat(
          infoObj.view - infoObj.startView
        )}人`,
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
