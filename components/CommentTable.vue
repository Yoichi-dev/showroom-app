<template>
  <v-col cols="12" sm="6">
    <v-card elevation="10">
      <v-simple-table :height="height" fixed-header>
        <thead>
          <tr>
            <th v-if="telopData" colspan="2" class="text-left">
              {{ telopData }}
            </th>
            <th
              v-else
              colspan="2"
              class="font-weight-thin text-left text-grey lighten-3"
            >
              (テロップは設定されていません)
            </th>
            <th class="font-weight-light text-left">
              <v-checkbox
                v-model="notificationFlg"
                label="通知系表示"
                color="success"
                class="mt-0"
                hide-details
                input-value="true"
                value
              ></v-checkbox>
            </th>
          </tr>
        </thead>
        <tbody
          id="commentArea"
          :class="
            $vuetify.breakpoint.name === 'xs' ||
            $vuetify.breakpoint.name === 'sm'
              ? ''
              : 'table-scale'
          "
        >
          <tr
            v-for="(comment, i) in commentData"
            :key="i"
            :class="
              $vuetify.breakpoint.name === 'xs' ||
              $vuetify.breakpoint.name === 'sm'
                ? ''
                : 'table-scale'
            "
          >
            <td
              v-if="comment.flg !== 'FF6C1A' && comment.flg !== 'follow'"
              class="pointer pr-0"
              style="width: 10px"
              @click="openProfile(comment.id)"
            >
              <img
                width="25"
                height="25"
                :src="
                  'https://image.showroom-cdn.com/showroom-prod/image/avatar/' +
                  comment.av +
                  '.png?v=92'
                "
              />
            </td>

            <td
              v-if="comment.flg !== 'FF6C1A' && comment.flg !== 'follow'"
              class="pointer"
              @click="openProfile(comment.id)"
            >
              <span v-if="comment.id === developer">
                <v-chip class="mb-1" color="purple" text-color="white" small>
                  {{ `開発者${comment.flg === 2 ? '(初見)' : ''}` }}
                </v-chip>
                {{ comment.name }}
              </span>
              <span v-else-if="comment.flg === 1">
                <v-chip class="mb-1" color="green" text-color="white" small>
                  ビギナー
                </v-chip>
                <span>{{ $nameCut(comment.name) }}</span>
              </span>
              <span v-else-if="comment.flg === 2">
                <v-chip class="mb-1" color="info" text-color="white" small>
                  初見
                </v-chip>
                <span>{{ $nameCut(comment.name) }}</span>
              </span>
              <span v-else>
                <span>{{ $nameCut(comment.name) }}</span>
              </span>
            </td>

            <td v-if="comment.flg !== 'FF6C1A' && comment.flg !== 'follow'">
              {{ comment.cm }}
            </td>

            <td
              v-if="notificationFlg && comment.flg === 'FF6C1A'"
              colspan="3"
              class="pointer grey lighten-5"
              @click="openProfile(comment.id)"
            >
              <span>
                <v-chip
                  v-if="comment.id === developer"
                  class="mb-1"
                  color="purple"
                  text-color="white"
                  small
                >
                  開発者
                </v-chip>
                {{ comment.cm }}
              </span>
            </td>
            <td
              v-if="notificationFlg && comment.flg === 'follow'"
              colspan="3"
              class="pointer pink lighten-5"
              @click="openProfile(comment.id)"
            >
              <v-icon color="pink lighten-3" text-color="white">
                mdi-heart
              </v-icon>
              <span class="ml-3">{{ comment.cm }}</span>
            </td>
          </tr>
          <tr></tr>
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
    commentData: {
      type: Array,
      required: true,
    },
    telopData: {
      type: String,
      required: false,
      default: null,
    },
  },
  data: () => ({
    developer: '',
    checkbox: true,
    notificationFlg: true,
    height: '82vh',
  }),
  mounted() {
    this.developer = constants.developer
    if (this.$vuetify.breakpoint.name === 'xs') {
      this.height = '50vh'
    }
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

.table-scale {
  transform: scaleY(-1);
}
</style>