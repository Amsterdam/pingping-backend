<template>
  <div>
    <button @click="callAction('FixUsers')">Fix Users</button>
    <button @click="callAction('DeleteAllUsers')">Delete All Users</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'AdminActions',

  methods: {
    callAction (type) {
      // console.log('type', type)
      // e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($type:AdminActionType!) {
            adminActions(type:$type)
          }`,
        variables: {
          type
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