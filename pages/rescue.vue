<template>
  <main class="uk-container uk-margin-top">
    <button @click="download">ダウンロード</button>
    <br />
    {{ streaminglog }}
  </main>
</template>

<script>
export default {
  name: 'SearchPage',
  data() {
    return {
      title: 'ログ救出',
      streaminglog: null,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  created() {
    setTimeout(() => {
      if (this.$store.state.streaminglog != null) {
        this.streaminglog = this.$store.state.streaminglog
      } else {
        this.$router.push('/')
      }
    }, 0)
  },
  methods: {
    download() {
      const blob = new Blob([JSON.stringify(this.streaminglog)], {
        type: 'application/json',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `log.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
}
</script>
