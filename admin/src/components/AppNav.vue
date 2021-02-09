<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="info"
  >
    <b-navbar-brand to="/">PingPing Admin</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav>
        <b-nav-item to="/users">Users</b-nav-item>
        <b-nav-item to="/rewards">Rewards</b-nav-item>
        <b-nav-item to="/audit-log">Audit Log</b-nav-item>
        <b-nav-item to="/feedback">Feedback</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item @click="logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'AppNav',

  methods: {
    logout () {
      if (window.confirm('Are you sure?')) {
        window.localStorage.removeItem('pp:token')
        location.reload()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>