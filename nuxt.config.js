import pkg from "./package.json";

export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | Comment Viewer',
    title: pkg.name,
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: '/',
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://api.showroom-app.com'
  },
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  build: {},
}
