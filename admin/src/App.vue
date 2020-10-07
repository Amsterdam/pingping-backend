<template>
  <div id="app">
    <h2>PingPing Admin</h2>

    <div v-if="isLoggedIn">
      <b-tabs content-class="mt-3">
        <b-tab
          title="Users"
          active
        >
          <Users />
        </b-tab>
        <b-tab title="Rewards">
          <Rewards />
        </b-tab>
        <b-tab title="Other">
          <AdminActions />
        </b-tab>
      </b-tabs>
    </div>

    <Login
      v-else
      @login="update"
    />
  </div>
</template>

<script>
import Users from './components/Users'
import Rewards from './components/Rewards'
import Login from './components/Login'
import AdminActions from './components/AdminActions'

export default {
  name: 'App',

  components: {
    Users,
    Rewards,
    Login,
    AdminActions
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
  margin-top: 30px;
}
</style>
