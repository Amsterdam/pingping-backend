<template>
  <div class="section">
    <table class="table">
      <thead>
        <tr>
          <th>Created</th>
          <th>Type</th>
          <th>User</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <AuditLogItem
          v-for="(item, index) in items"
          :key="'item-' + index"
          v-bind="item"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { GetAuditLogQuery } from '../queries/GetAuditLogQuery'
import AuditLogItem from '../components/AuditLogItem'

export default {
  name: 'PageAuditLog',

  components: {
    AuditLogItem
  },

  mounted () {
    this.$apollo.query({
      query: GetAuditLogQuery
    }).then(({ data }) => {
      this.items = data.adminGetAuditLog
    })
  },

  data () {
    return {
      items: []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>