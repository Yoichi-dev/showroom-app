import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | ShowTube',
    title: 'ShowTube',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'ShowTube | SRビューワー' },
      { hid: 'og:title', property: 'og:title', content: 'ShowTube | SRビューワー' },
      { hid: 'og:url', property: 'og:url', content: 'https://showtube.showroom-app.com' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'keywords', name: 'keywords', content: 'ShowTube,watchlog,showroom,ショールーム,配信ログ,ログ,コメビュ,コメントビューアー' },
      { hid: 'og:image', property: 'og:image', content: 'https://showtube.showroom-app.com/og.png?20230603' },
      { name: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', property: 'twitter:creator', content: '@TYoichiro' },
      { name: 'twitter:site', property: 'twitter:site', content: '@TYoichiro' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  pwa: {
    manifest: {
      lang: 'ja',
    },
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
