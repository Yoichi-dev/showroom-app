<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" dense fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push('/')"
        v-text="title"
      />
      <v-spacer />
      Ver.{{ version }}
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} {{ author }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import pkg from '~/package.json'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: true,
      drawer: null,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'ホーム',
          to: '/',
        },
        {
          icon: 'mdi-math-log',
          title: 'ログ一覧',
          to: '/log',
        },
        {
          icon: 'mdi-account',
          title: 'リスナー名変更',
          to: '/name',
        },
        {
          icon: 'mdi-account-cancel',
          title: 'ブロック一覧',
          to: '/block',
        },
        {
          icon: 'mdi-content-copy',
          title: 'データ引継ぎ',
          to: '/transfer',
        },
      ],
      title: 'Watch Log β版',
      author: 'T.Yoichiro',
      version: pkg.version,
    }
  },
}
</script>
