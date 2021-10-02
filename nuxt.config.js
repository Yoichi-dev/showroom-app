import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | Watch Log',
    title: 'Watch Log',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Watch Log | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:title', property: 'og:title', content: 'Watch Log | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:url', property: 'og:url', content: 'https://watch-log.showroom-app.com' },
      { hid: 'description', name: 'description', content: 'SHOWROOM配信のログを確認することができます' },
      { hid: 'og:image', property: 'og:image', content: 'https://watch-log.showroom-app.com/og.png?20211001' },
      { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
  ],
  plugins: [
    { src: '~/plugins/localStorage.js', ssr: false }
  ],
  components: true,
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['@nuxtjs/moment', ['ja']],
    '@nuxtjs/dotenv',
  ],
  axios: {},
  pwa: {
    manifest: {
      lang: 'ja'
    }
  },
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  env: {
    API_URL: process.env.API_URL,
    API_SUB_URL: process.env.API_SUB_URL
  },
  vuetify: {
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
          success: colors.green.accent3
        }
      }
    }
  },
  build: {
  }
}