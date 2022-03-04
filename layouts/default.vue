<template>
  <div>
    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
          <li class="uk-active">
            <a @click="$router.push('/')">Watch Log β create by T.Yoichiro</a>
          </li>
        </ul>
      </div>
    </nav>
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Watch Log β版',
    }
  },
}
</script>

<style>
.uk-navbar-nav > li > a {
  text-transform: none;
}

.uk-table th {
  text-transform: none;
}

.pointer {
  cursor: pointer;
}

.scrollbar {
  overflow: scroll;
}

.first-look {
  background-color: aliceblue;
}

.developer {
  background-color: lavender;
}

.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
