<template>
  <div>
    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
          <li class="uk-active">
            <a @click="$router.push('/')"
              >{{ title }} Ver.{{ version }} Create by T.Yoichiro
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <Nuxt />
  </div>
</template>

<script>
import pkg from '~/package.json'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Watch Log',
      version: pkg.version,
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
  scrollbar-width: none;
}

.first-look {
  background-color: aliceblue;
}

.visitor {
  background-color: rgba(172, 172, 172, 0.1);
}

.developer {
  background-color: rgba(230, 230, 250, 0.5);
}

.scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
