<template>
  <div id="app">
    <h2>PingPing Admin</h2>

    <Users v-if="isLoggedIn" />
    <Login
      v-else
      @login="update"
    />
  </div>
</template>

<script>
import Users from './components/Users'
import Login from './components/Login'

export default {
  name: 'App',

  components: {
    Users,
    Login
  },

  methods: {
    update () {
      this.loggedIn = true
    }
  },

  computed: {
    isLoggedIn () {
      return window.localStorage.getItem('pp:token') !== null || this.loggedIn
    }
  },

  data () {
    return {
      loggedIn: false
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
