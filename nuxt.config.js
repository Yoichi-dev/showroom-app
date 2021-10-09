require('dotenv').config()
export default {
  ssr: false,
  target: 'static',
  head: {
    title: '利用申請サイト',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Game | ゲームサーバー利用申請サイト' },
      { hid: 'og:title', property: 'og:title', content: 'Game | ゲームサーバー利用申請サイト' },
      { hid: 'og:url', property: 'og:url', content: 'https://game.showroom-app.com' },
      { hid: 'description', name: 'description', content: 'ゲームサーバー利用申請サイトになります' },
      { hid: 'og:image', property: 'og:image', content: 'https://game.showroom-app.com/og.png?20211001' },
      { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css' }
    ]
  },
  css: [
    '@/assets/css/neumorphism.css'
  ],
  plugins: [
  ],
  components: true,
  buildModules: [
  ],
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {},
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  env: {
    API_URL: process.env.API_URL,
    MINECRAFT_SERVER: process.env.MINECRAFT_SERVER,
  },
  build: {
  }
}
