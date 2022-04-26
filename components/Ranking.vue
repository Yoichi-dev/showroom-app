<template>
  <div>
    <div id="ranking" class="gift uk-card uk-card-default scrollbar">
      <table class="uk-table uk-table-small uk-table-divider">
        <thead>
          <tr>
            <th colspan="2">配信内ランキング(100位まで)</th>
            <!-- <th>
              合計
              {{ formatNum(totalPoint) }}pt
            </th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in ranking"
            :key="user.order_no"
            :class="
              user.user.flg == 2
                ? 'pointer first-look'
                : user.user.user_id == developerId
                ? 'pointer developer'
                : 'pointer'
            "
            @click="getListener(user.user.user_id)"
          >
            <td>{{ user.order_no }}</td>
            <td>
              <img width="25" height="25" :src="user.user.avatar_url" />&ensp;{{
                user.user.name.length > 13
                  ? user.user.name.slice(0, 13) + '…'
                  : user.user.name
              }}
            </td>
            <!-- <td>{{ formatNum(user.point) }}pt</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingConponent',
  props: {
    ranking: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      totalPoint: 0,
      developerId: '3699368',
    }
  },
  watch: {
    ranking(data) {
      this.totalPoint = 0
      for (let i = 0; i < data.length; i++) {
        this.totalPoint += data[i].point
      }
    },
  },
  methods: {
    formatNum(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    },
    getListener(id) {
      this.$emit('parentMethod', id)
    },
  },
}
</script>
