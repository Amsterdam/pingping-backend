<template>
  <div>
    <button
      v-for="action,a in actions"
      :key="'action-' + a"
      @click="callAction(action)"
    >{{ action }}</button>
    <span v-if="actions.length === 0">No actions</span>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'AdminActions',

  methods: {
    callAction (type) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($type:AdminActionType!) {
            adminActions(type:$type)
          }`,
        variables: {
          type
        }
      }).then(() => {
      }).catch((error) => {
        console.error(error)
      })
    }
  },

  data () {
    return {
      actions: [
        'DataSetMigration',
        'FixStatistics'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  margin-right: 10px;
}
</style>