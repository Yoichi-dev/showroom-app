<template>
  <v-col cols="12" sm="6">
    <v-card elevation="10">
      <v-simple-table height="40vh">
        <tbody>
          <tr
            v-for="(item, i) in rankingData"
            :key="i"
            class="pointer"
            @click="openProfile(item.user.user_id)"
          >
            <td class="text-nowrap mr-0 pr-1">{{ item.order_no }}位</td>
            <td class="mx-0 px-0">
              <v-img
                max-height="25"
                max-width="25"
                :src="item.user.avatar_url"
              />
            </td>
            <td class="mr-0 pr-0">
              <span v-if="item.user.user_id === developer">
                <v-chip class="mb-1" color="purple" text-color="white" small>
                  {{ `開発者${item.flg === 2 ? '(初見)' : ''}` }}
                </v-chip>
                {{ item.user.name }}
              </span>
              <span v-else>
                <span>{{ $nameCut(item.user.name) }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <UserProfile ref="profile" />
  </v-col>
</template>

<script>
import UserProfile from '~/components/UserProfile'
import constants from '~/constants'

export default {
  name: 'RankingTable',
  components: {
    UserProfile,
  },
  props: {
    rankingData: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    developer: '',
  }),
  mounted() {
    this.developer = constants.developer
  },
  methods: {
    openProfile(id) {
      this.$refs.profile.getUserData(id)
    },
  },
}
</script>

<style scoped>
.text-nowrap {
  white-space: nowrap;
}

.pointer {
  cursor: pointer;
}
</style>