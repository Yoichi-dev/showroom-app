<template>
  <div>
    <v-container>
      <v-row class="mt-5">
        <v-col>
          <p class="text-h5">リスナー名管理</p>
          WatchLog内で表示するリスナーの名前を個別に設定して固定する事ができます
          <p class="mt-15">鋭意制作中</p>
        </v-col>
      </v-row>
    </v-container>
    <UserProfile ref="profile" />
  </div>
</template>

<script>
import UserProfile from '~/components/UserProfile'

export default {
  name: 'BlockPage',
  components: {
    UserProfile,
  },
  data: () => ({
    title: '',
  }),
  mounted() {},
  methods: {
    openProfile(id) {
      this.$refs.profile.getUserData(id)
    },
  },
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>