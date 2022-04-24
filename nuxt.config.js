import pkg from "./package.json";
require('dotenv').config()

export default {
  ssr: false,
  target: 'static',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Watch Log β | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:title', property: 'og:title', content: 'Watch Log β | 配信中のコメント・ギフト確認ツール' },
      { hid: 'og:url', property: 'og:url', content: 'https://watch-log-beta.showroom-app.com' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'og:image', property: 'og:image', content: 'https://watch-log-beta.showroom-app.com/og.png?20200303' },
      { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [
    { src: '~/plugins/localStorage.js', ssr: false },
    '@/plugins/contentful'
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['@nuxtjs/moment', ['ja']],
    '@nuxtjs/dotenv',
    "~/modules/uikit"
  ],
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
  env: {
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
  },
  build: {},
}
