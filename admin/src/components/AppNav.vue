<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="info"
  >
    <b-navbar-brand href="#">PingPing Admin</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav>
        <b-nav-item to="/users">Users</b-nav-item>
        <b-nav-item to="/rewards">Rewards</b-nav-item>
        <b-nav-item to="/audit-log">Audit Log</b-nav-item>
        <b-nav-item to="/settings">Settings</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'AppNav'
}
</script>

<style lang="scss" scoped>
</style>