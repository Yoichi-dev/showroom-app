<template>
  <v-col cols="12" sm="6">
    <v-card elevation="10">
      <v-simple-table height="40vh">
        <tbody>
          <tr
            v-for="(item, i) in countData"
            :key="i"
            class="pointer"
            @click="openProfile(item.id)"
          >
            <td class="mx-0 pl-2 pr-2" style="width: 10px">
              <v-img
                max-height="25"
                max-width="25"
                :src="
                  'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                  item.av +
                  '.png?v=85'
                "
              />
            </td>
            <td class="mx-0 px-0">
              <span v-if="item.id === developer">
                <v-chip class="mb-1" color="purple" text-color="white" small>
                  {{ `開発者${item.flg === 2 ? '(初見)' : ''}` }}
                </v-chip>
                {{ item.name }}
              </span>
              <span v-else-if="item.flg === 1">
                <v-chip class="mb-1" color="green" text-color="white" small>
                  ビギナー
                </v-chip>
                {{ $nameCut(item.name) }}
              </span>
              <span v-else-if="item.flg === 2">
                <v-chip class="mb-1" color="info" text-color="white" small>
                  初見
                </v-chip>
                {{ $nameCut(item.name) }}
              </span>
              <span v-else-if="item.flg === 4">
                <v-chip class="mb-1" color="orange" text-color="white" small>
                  公式
                </v-chip>
                {{ $nameCut(item.name) }}
              </span>
              <span v-else>
                <span>{{ $nameCut(item.name) }}</span>
              </span>
            </td>
            <td class="ml-1 pl-1 text-nowrap" style="width: 20px">
              {{ item.num }}
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
  name: 'CountTable',
  components: {
    UserProfile,
  },
  props: {
    countData: {
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