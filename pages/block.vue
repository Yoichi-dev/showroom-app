<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        <v-col>
          <p class="text-h5">ブロックユーザー管理</p>
          開発者によるWatchLog内での強制ブロックユーザーは現在{{
            adminBlockUserId.length
          }}人（非公開）います
          <v-simple-table v-if="userBlockUsers.length !== 0" class="mt-15">
            <thead>
              <tr>
                <th style="width: 10px"></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in userBlockUsers"
                :key="user.account_id"
                class="pointer"
                @click="openProfile(user.account_id)"
              >
                <td>
                  <img width="25" height="25" :src="user.avatar_url" />
                </td>
                <td>
                  {{ user.name }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <p v-if="userBlockUsers.length === 0" class="mt-15">
            現在個別ブロックしているユーザーはいません
          </p>
        </v-col>
      </v-row>
    </v-container>
    <UserProfile ref="profile" />
  </div>
</template>

<script>
import client from '~/plugins/contentful'
import UserProfile from '~/components/UserProfile'

export default {
  name: 'BlockPage',
  components: {
    UserProfile,
  },
  async asyncData() {
    let adminBlockUsers = []
    await client
      .getEntries({
        content_type: 'block',
      })
      .then((res) => (adminBlockUsers = res.items[0].fields.userId))
    return { adminBlockUsers }
  },
  data: () => ({
    title: '',
    adminBlockUserId: [3377243, 3640889, 4180180, 3840137, 2862557, 4289196],
    blockUsers: [],
    userBlockUsers: [],
  }),
  mounted() {
    this.updateTable()
  },
  methods: {
    updateTable() {
      if (localStorage.block_users) {
        this.userBlockUsers = JSON.parse(localStorage.block_users)
      }
    },
    openProfile(id) {
      this.$refs.profile.getUserData(id)
      const check = setInterval(() => {
        if (!this.$refs.profile.dialog) {
          clearInterval(check)
          this.updateTable()
        }
      }, 500)
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>