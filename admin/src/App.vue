<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <AppNav />
      <div class="page">
        <router-view></router-view>
      </div>
    </div>

    <LoginForm v-else />
  </div>
</template>

<script>
import Login from './components/Login'
import AppNav from './components/AppNav'

export default {
  name: 'App',

  components: {
    LoginForm: Login,
    AppNav
  },

  computed: {
    isLoggedIn () {
      return window.localStorage.getItem('pp:token') !== null || this.loggedIn
    }
  },

  watch: {
    isLoggedIn (val) {
      if (val) {
        this.fetch()
      }
    }
  }
}
</script>

<style lang="scss">
$theme-colors: (
  'primary': #003f5c,
  'secondary': #fb9f4b,
  'danger': #ff6361,
);

@import 'css/custom.scss';
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/dist/bootstrap-vue.css';

body,
html {
  background-color: #dfe8e7;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.page {
  max-width: 100%;
  padding: 0.5rem;
  background-color: #dfe8e7;
}

.section {
  border-radius: 5px;
  background-color: #fff;
  /* margin: 1rem; */
}

.clickable:hover {
  text-decoration: underline;
  cursor: pointer;
}

.block {
  padding: 0.5rem !important;
  max-width: 100%;
}

.block-inner {
  padding: 1rem;
  border-radius: 3px;
  background-color: #fff;
}

.addition {
  font-size: 75%;
  margin-bottom: -1rem;
}

.text-link {
  text-decoration: underline;
  cursor: pointer;
}

.text-link:hover {
  text-decoration: none;
}
</style>
