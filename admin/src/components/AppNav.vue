<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="primary"
    :class="navBarClass"
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

  computed: {
    navBarClass () {
      return `env-${process.env.NODE_ENV}`
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar.env-development {
  background: repeating-linear-gradient(45deg, #003f5c, #003f5c 10px, #448a86 10px, #448a86 20px);
}
</style>