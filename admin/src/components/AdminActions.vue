<template>
  <div>
    <button @click="fixUsers">Fix Users</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'AdminActions',

  methods: {
    fixUsers (e) {
      e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation {
            adminActions
          }`,
        variables: {
        }
      }).then((data) => {
        console.log(data)
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>