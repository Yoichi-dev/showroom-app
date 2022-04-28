<template>
  <div
    id="free"
    class="
      uk-margin-bottom uk-card uk-card-default uk-grid-row-small
      gift
      scrollbar
    "
  >
    <table class="uk-table uk-table-small uk-table-hover uk-table-divider">
      <tbody>
        <tr
          v-for="(item, index) in gift"
          :key="index"
          :class="
            item.flg == 2
              ? 'pointer first-look'
              : item.id == developerId
              ? 'pointer developer'
              : 'pointer'
          "
          @click="getListener(item.id)"
        >
          <td>
            <img
              width="25"
              height="25"
              :src="
                'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                item.avatar +
                '.png?v=85'
              "
            />&ensp;{{
              item.name.length > 18 ? item.name.slice(0, 18) + '…' : item.name
            }}
          </td>
          <td style="width: 80px">
            <img
              width="25"
              height="25"
              :src="
                'https://image.showroom-cdn.com/showroom-prod/assets/img/gift/' +
                item.gitId +
                '_s.png'
              "
            />×{{ formatNum(item.num) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'GiftConponent',
  props: {
    gift: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      developerId: '3699368',
    }
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
