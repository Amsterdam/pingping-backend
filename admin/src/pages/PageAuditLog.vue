<template>
  <div class="section">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>id</th>
          <th>created</th>
          <th>device</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {{ items }}
      </tbody>
    </table>
  </div>
</template>

<script>
import { GetAuditLogQuery } from '../queries/GetAuditLogQuery'
// import { mapState } from 'vuex'

export default {
  name: 'PageAuditLog',

  // computed: {
  //   ...mapState({
  //     items: state => state.logs.items
  //   })
  // },

  mounted () {
    this.$apollo.query({
      query: GetAuditLogQuery
    }).then(({ data }) => {
      this.items = data.getAuditLog
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