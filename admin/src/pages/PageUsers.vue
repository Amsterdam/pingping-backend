<template>
  <div class="page section">
    <b-tabs
      class="section"
      content-class="mt-3"
    >
      <b-tab
        title="Users"
        active
      >
        <UserTable role="user" />
      </b-tab>
      <b-tab title="Admins">
        <UserTable role="admin" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import UserTable from '../components/UserTable'

export default {
  name: 'PageUsers',

  components: {
    UserTable
  },
}
</script>

<style lang="css" scoped>
.jumbotron {
  padding: 1rem;
  margin-top: 2rem;
}

.section {
  text-align: left;
}
</style>