import colors from 'vuetify/es5/util/colors'
import pkg from "./package.json";

export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | Watch Log',
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Watch Log | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:title', property: 'og:title', content: 'Watch Log | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:url', property: 'og:url', content: 'https://watch-log.showroom-app.com' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'keywords', name: 'keywords', content: 'ウォッチログ,watchlog,showroom,ショールーム,配信ログ,ログ,コメビュ,コメントビューアー' },
      { hid: 'og:image', property: 'og:image', content: 'https://watch-log.showroom-app.com/og.png?20221010' },
      { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [
    '@/plugins/numberFormat',
    '@/plugins/nameCut',
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  moment: {
    locales: ['ja']
  },
  axios: {
    baseURL: '/',
  },
  pwa: {
    manifest: {
      lang: 'ja',
    },
  },
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  env: {
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
  },
  build: {},
}
