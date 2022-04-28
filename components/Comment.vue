<template>
  <div>
    <div id="comment" class="uk-card uk-card-default scrollbar">
      <table class="uk-table uk-table-small uk-table-hover uk-table-divider">
        <thead>
          <tr>
            <th colspan="2">{{ telop }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in comment"
            :key="index"
            :class="
              item.flg == 2
                ? 'pointer first-look'
                : item.id == developerId
                ? 'pointer developer'
                : item.flg == 'FF6C1A'
                ? 'pointer visitor'
                : 'pointer'
            "
          >
            <td v-if="item.flg != 'FF6C1A'" @click="getListener(item.id)">
              <img
                width="25"
                height="25"
                :src="
                  'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                  item.avatar +
                  '.png?v=85'
                "
              />&ensp;{{
                item.name.length > 15 ? item.name.slice(0, 15) + '…' : item.name
              }}
            </td>
            <td v-if="item.flg != 'FF6C1A'">{{ item.comment }}</td>
            <td
              v-if="item.flg == 'FF6C1A'"
              colspan="2"
              @click="getListener(item.id)"
            >
              {{ item.comment }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentConponent',
  props: {
    comment: {
      type: Array,
      required: true,
    },
    telop: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      developerId: '3699368',
    }
  },
  methods: {
    getListener(id) {
      this.$emit('parentMethod', id)
    },
  },
}
</script>
