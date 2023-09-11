<template>
  <v-col cols="12" sm="6" class="scrollbar">
    <v-card elevation="10">
      <v-simple-table height="40vh">
        <tbody>
          <tr v-for="(item, i) in gitfData" :key="i" class="pointer" @click="openProfile(item.id)">
            <td class="mx-0 pl-2 pr-2" style="width: 10px">
              <v-img max-height="25" max-width="25" :src="'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                item.av +
                '.png?v=92'
                " />
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
                {{ $nameCut(item.name) }}
              </span>
            </td>
            <td class="mx-0 px-0" style="width: 10px">
              <span v-if="giftFlg">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <img width="25" height="25" :src="'https://image.showroom-cdn.com/showroom-prod/assets/img/gift/' +
                      item.gid +
                      '_s.png'
                      " v-bind="attrs" v-on="on" @error="onImgError" />
                  </template>
                  <span> {{ $numberFormat(getGiftPoint(item.gid)) }}G </span>
                </v-tooltip>
              </span>

              <span v-else>
                <img width="25" height="25" :src="'https://image.showroom-cdn.com/showroom-prod/image/gift/' +
                  item.gid +
                  '_s.png'
                  " @error="onImgError" />
              </span>
            </td>
            <td class="ml-1 pl-1 text-nowrap" style="width: 20px">
              <span v-if="giftFlg">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      × {{ $numberFormat(item.num) }}
                    </span>
                  </template>
                  <span>
                    {{ $numberFormat(item.num * getGiftPoint(item.gid)) }}pt
                  </span>
                </v-tooltip>
              </span>

              <span v-else> × {{ $numberFormat(item.num) }} </span>
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
  name: 'GiftTable',
  components: {
    UserProfile,
  },
  props: {
    gitfData: {
      type: Array,
      required: true,
    },
    giftFlg: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    developer: '',
    useGiftList: [],
  }),
  mounted() {
    this.developer = constants.developer
  },
  methods: {
    openProfile(id) {
      this.$refs.profile.getUserData(id)
    },
    getGiftPoint(id) {
      const useGiftPoint = this.useGiftList.find((e) => e.gift_id === id)
      if (useGiftPoint !== undefined) {
        return useGiftPoint.point
      } else {
        return 0
      }
    },
    nameCut(name) {
      return name.substring(0, name.indexOf('@'))
    },
    onImgError(e) {
      e.target.src =
        'https://image.showroom-cdn.com/showroom-prod/image/gift/' +
        e.target.src.replace(
          'https://image.showroom-cdn.com/showroom-prod/assets/img/gift/',
          ''
        )
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