<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <AppNav />
      <router-view></router-view>
    </div>

    <Login v-else />
  </div>
</template>

<script>
import _ from 'lodash'
import Login from './components/Login'
import AppNav from './components/AppNav'
import { GetUsersQuery } from './queries/GetUsersQuery'

export default {
  name: 'App',

  components: {
    Login,
    AppNav
  },

  mounted () {
    if (this.isLoggedIn) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.fetchUsers()
    },

    fetchUsers () {
      this.$apollo.query({
        query: GetUsersQuery,
        update: (store, { data }) => {
          store.writeData({ query: GetUsersQuery, data })
        }
      }).then(({ data }) => {
        this.$store.commit('users/setItems', data.adminGetUsers.map(i => {
          return {
            ...i,
            selected: false,
            device: _.first(i.devices.filter(d => d.notificationStatus === 'Approved'))
          }
        }))
      }).catch((error) => {
        if (error.message === 'GraphQL error: unauthorized') {
          window.localStorage.removeItem('pp:token')
          window.alert('unauthorized')
          window.setTimeout(() => {
            location.reload()
          }, 1000)
        }
      })
    }
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.clickable:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
